from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import re
import sqlite3
import pymysql
import requests
import datetime
import base64
import jwt
import bcrypt
from functools import wraps
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel('gemini-1.5-flash')

app.config['UPLOAD_FOLDER'] = os.path.join("static", "Images")
app.config['SECRET_KEY'] = os.getenv("JWT_SECRET", "secret123")
app.config['ADMIN_PASSWORD'] = os.getenv("ADMIN_PASSWORD", "4734")
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# ── Database mode ─────────────────────────────────────────────────────────────
USE_LOCAL_DB = os.getenv("LOCAL_DB", "false").lower() == "true"
SQLITE_PATH  = os.path.join(os.path.dirname(__file__), "naturemart.db")


class _SQLiteCursor:
    """Thin wrapper: translates %s → ?, returns plain dicts."""
    def __init__(self, cur):
        self._cur = cur

    @staticmethod
    def _fix(sql):
        return re.sub(r'%s', '?', sql)

    def execute(self, sql, args=()):
        self._cur.execute(self._fix(sql), args)

    def fetchone(self):
        row = self._cur.fetchone()
        return dict(row) if row else None

    def fetchall(self):
        return [dict(r) for r in self._cur.fetchall()]

    def __enter__(self):  return self
    def __exit__(self, *_): pass


class _SQLiteConn:
    """Singleton SQLite connection; close() is a no-op so finally blocks work."""
    _inst = None

    def __new__(cls):
        if cls._inst is None:
            conn = sqlite3.connect(SQLITE_PATH, check_same_thread=False)
            conn.row_factory = sqlite3.Row
            cls._inst = object.__new__(cls)
            cls._inst._conn = conn
            cls._inst._bootstrap()
        return cls._inst

    def _bootstrap(self):
        """Create tables if they don't exist yet."""
        self._conn.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id       INTEGER PRIMARY KEY AUTOINCREMENT,
                name     TEXT    NOT NULL,
                email    TEXT    NOT NULL UNIQUE,
                password TEXT    NOT NULL,
                phone    TEXT    DEFAULT '',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS products (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                name        TEXT,
                description TEXT,
                price       REAL,
                image       TEXT,
                category    TEXT    DEFAULT 'General',
                stock       INTEGER DEFAULT 0,
                created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS orders (
                id               INTEGER PRIMARY KEY AUTOINCREMENT,
                userId           INTEGER,
                status           TEXT DEFAULT 'pending',
                trackingNumber   TEXT,
                deliveryPartner  TEXT,
                estimatedDelivery TEXT,
                createdAt        DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS messages (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_id   INTEGER,
                receiver_id INTEGER,
                message     TEXT,
                is_read     INTEGER DEFAULT 0,
                createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        """)
        self._conn.commit()

    def cursor(self):
        return _SQLiteCursor(self._conn.cursor())

    def commit(self):
        self._conn.commit()

    def close(self):
        pass  # singleton – stay open


def get_db_connection():
    """Return a DB connection (SQLite locally, MySQL in production)."""
    if USE_LOCAL_DB:
        return _SQLiteConn()
    return pymysql.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        database=os.getenv("DB_NAME"),
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route("/api/db_status", methods=["GET"])
def db_status():
    """Check if the database connection is working."""
    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return jsonify({
            "success": True, 
            "message": "Database connected successfully",
            "mode": "Local (SQLite)" if USE_LOCAL_DB else "Remote (MySQL)"
        })
    except Exception as e:
        return jsonify({"success": False, "message": f"Database connection failed: {str(e)}"}), 500
    finally:
        if connection:
            connection.close()

# JWT Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'success': False, 'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id = data['user_id']
        except Exception as e:
            return jsonify({'success': False, 'message': 'Token is invalid!', 'error': str(e)}), 401
        
        return f(current_user_id, *args, **kwargs)
    
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        admin_password = request.headers.get("X-Admin-Password", "")
        if admin_password != app.config['ADMIN_PASSWORD']:
            return jsonify({'success': False, 'message': 'Admin password is incorrect.'}), 401
        return f(*args, **kwargs)

    return decorated


def normalize_mpesa_phone(phone):
    digits = re.sub(r'\D', '', str(phone or ''))

    if digits.startswith('254') and len(digits) == 12:
        normalized = digits
    elif digits.startswith('0') and len(digits) == 10:
        normalized = '254' + digits[1:]
    elif digits.startswith('7') and len(digits) == 9:
        normalized = '254' + digits
    elif digits.startswith('1') and len(digits) == 9:
        normalized = '254' + digits
    else:
        return None

    if re.fullmatch(r'254(7|1)\d{8}', normalized):
        return normalized

    return None


@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone", "")

    if not name or not email or not password:
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Check if user already exists
            cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
            if cursor.fetchone():
                return jsonify({"success": False, "message": "Email already registered"}), 400

            sql = "INSERT INTO users (name, email, password, phone) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (name, email, hashed_password, phone))
        connection.commit()
        return jsonify({"success": True, "message": "User registered successfully!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if connection:
            connection.close()

@app.route("/api/signin", methods=["POST"])
def signin():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Missing email or password"}), 400

    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = "SELECT * FROM users WHERE email=%s"
            cursor.execute(sql, (email,))
            user = cursor.fetchone()
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            # Generate JWT
            token = jwt.encode({
                'user_id': user['id'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, app.config['SECRET_KEY'], algorithm="HS256")

            # Remove password from response
            user.pop('password', None)
            return jsonify({
                "success": True, 
                "message": "User signed in successfully!", 
                "user": user, 
                "token": token
            })
        else:
            return jsonify({"success": False, "message": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if connection:
            connection.close()

@app.route("/api/google_auth", methods=["POST"])
def google_auth():
    data = request.json
    credential = data.get("credential")
    
    if not credential:
        return jsonify({"success": False, "message": "Credential is missing!"}), 400
        
    try:
        # Verify the ID token
        idinfo = id_token.verify_oauth2_token(
            credential, 
            google_requests.Request(), 
            os.getenv("GOOGLE_CLIENT_ID")
        )

        # ID token is valid. Get the user's Google ID from the decoded token.
        email = idinfo['email']
        name = idinfo.get('name', email.split('@')[0])
        picture = idinfo.get('picture', '')

        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Check if user already exists
            sql = "SELECT * FROM users WHERE email=%s"
            cursor.execute(sql, (email,))
            user = cursor.fetchone()
            
            if not user:
                # Create a new user if they don't exist
                # For Google users, we might not have a password, so we set a dummy one
                dummy_password = bcrypt.hashpw(os.urandom(24).hex().encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                sql = "INSERT INTO users (name, email, password, phone) VALUES (%s, %s, %s, %s)"
                cursor.execute(sql, (name, email, dummy_password, ""))
                connection.commit()
                
                # Fetch the newly created user
                cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
                user = cursor.fetchone()

        # Generate JWT for our app
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")

        user.pop('password', None)
        return jsonify({
            "success": True, 
            "message": "Google authentication successful!", 
            "user": user, 
            "token": token
        })
        
    except ValueError:
        # Invalid token
        return jsonify({"success": False, "message": "Invalid Google token!"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if 'connection' in locals():
            connection.close()

@app.route("/api/github_auth", methods=["POST"])
def github_auth():
    data = request.json
    code = data.get("code")
    
    if not code:
        return jsonify({"success": False, "message": "Code is missing!"}), 400
        
    try:
        # Exchange code for access token
        client_id = os.getenv("GITHUB_CLIENT_ID")
        client_secret = os.getenv("GITHUB_CLIENT_SECRET")
        
        token_res = requests.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code
            }
        )
        token_data = token_res.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            return jsonify({"success": False, "message": "Failed to get access token from GitHub", "details": token_data}), 401
            
        # Get user info
        user_res = requests.get(
            "https://api.github.com/user",
            headers={"Authorization": f"token {access_token}"}
        )
        github_user = user_res.json()
        
        # Get user emails (if primary is private)
        email = github_user.get("email")
        if not email:
            emails_res = requests.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"token {access_token}"}
            )
            emails = emails_res.json()
            primary_email = next((e for e in emails if e["primary"]), emails[0])
            email = primary_email["email"]

        name = github_user.get("name") or github_user.get("login") or email.split('@')[0]

        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Check if user already exists
            sql = "SELECT * FROM users WHERE email=%s"
            cursor.execute(sql, (email,))
            user = cursor.fetchone()
            
            if not user:
                # Create a new user
                dummy_password = bcrypt.hashpw(os.urandom(24).hex().encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                sql = "INSERT INTO users (name, email, password, phone) VALUES (%s, %s, %s, %s)"
                cursor.execute(sql, (name, email, dummy_password, ""))
                connection.commit()
                
                # Fetch the newly created user
                cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
                user = cursor.fetchone()

        # Generate JWT for our app
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")

        user.pop('password', None)
        return jsonify({
            "success": True, 
            "message": "GitHub authentication successful!", 
            "user": user, 
            "token": token
        })
        
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if 'connection' in locals():
            connection.close()

@app.route("/api/add_product", methods=["POST"])
@admin_required
def add_product():
    product_name = request.form.get("name")
    product_description = request.form.get("description")
    product_price = request.form.get("price")
    product_category = request.form.get("category", "General")
    product_stock = request.form.get("stock", 0)
    
    products_photo = request.files.get("image")
    photo_path = ""
    
    if products_photo:
        photo_path = os.path.join(app.config["UPLOAD_FOLDER"], products_photo.filename)
        products_photo.save(photo_path)

    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = "INSERT INTO products (name, description, price, image, category, stock) VALUES (%s, %s, %s, %s, %s, %s)"
            cursor.execute(sql, (product_name, product_description, product_price, photo_path, product_category, product_stock))
        connection.commit()
        return jsonify({"success": True, "message": "Product added successfully!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if connection:
            connection.close()

@app.route("/api/get_products", methods=["GET"])
def get_products():
    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = "SELECT * FROM products"
            cursor.execute(sql)
            products = cursor.fetchall()
        return jsonify(products)
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if connection:
            connection.close()

@app.route('/api/mpesa_payment', methods=['POST'])
def mpesa_payment():
    data = request.get_json(silent=True) or {}
    amount = data.get('amount')
    raw_phone = data.get('phone', '')
    phone = normalize_mpesa_phone(raw_phone)
    
    consumer_key = os.getenv("MPESA_CONSUMER_KEY", "GTWADFxIpUfDoNikNGqq1C3023evM6UH")
    consumer_secret = os.getenv("MPESA_CONSUMER_SECRET", "amFbAoUByPV2rM5A")
 
    try:
        if not phone:
            return jsonify({
                "success": False,
                "message": "Enter a valid Safaricom number, for example 0712345678 or 254712345678."
            }), 400

        try:
            amount = int(float(amount))
        except (TypeError, ValueError):
            return jsonify({"success": False, "message": "Enter a valid payment amount."}), 400

        amount = max(amount, 1)

        api_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        r = requests.get(api_URL, auth=HTTPBasicAuth(consumer_key, consumer_secret), timeout=30)
        token_data = r.json()
        if r.status_code != 200 or "access_token" not in token_data:
            return jsonify({
                "success": False,
                "message": "Could not authenticate with M-Pesa. Check your Daraja consumer key and secret.",
                "details": token_data
            }), 502

        access_token = "Bearer " + token_data['access_token']
 
        timestamp = datetime.datetime.today().strftime('%Y%m%d%H%M%S')
        passkey = os.getenv("MPESA_PASSKEY", 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919')
        business_short_code = os.getenv("MPESA_SHORTCODE", "174379")
        callback_url = os.getenv("MPESA_CALLBACK_URL", "https://gregoryisaac.alwaysdata.net/api/mpesa_callback")
        password_data = business_short_code + passkey + timestamp
        password = base64.b64encode(password_data.encode()).decode('utf-8')
 
        payload = {
            "BusinessShortCode": business_short_code,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount or "1",
            "PartyA": phone,
            "PartyB": business_short_code,
            "PhoneNumber": phone,
            "CallBackURL": callback_url,
            "AccountReference": "NatureMart",
            "TransactionDesc": "Payment for order"
        }
 
        headers = {"Authorization": access_token, "Content-Type": "application/json"}
        url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
 
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response_data = response.json()
        if response.status_code == 200 and response_data.get("ResponseCode") == "0":
            return jsonify({
                "success": True,
                "message": "Please complete payment on your phone",
                "details": response_data
            })

        return jsonify({
            "success": False,
            "message": response_data.get("errorMessage") or response_data.get("ResponseDescription") or "M-Pesa rejected the STK push request.",
            "details": response_data
        }), 400
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route('/api/mpesa_callback', methods=['POST'])
def mpesa_callback():
    return jsonify({"success": True, "message": "Callback received"})

@app.route("/api/track_order/<int:order_id>", methods=["GET"])
def track_order(order_id):
    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = "SELECT id, status, trackingNumber, deliveryPartner, estimatedDelivery, createdAt FROM orders WHERE id=%s"
            cursor.execute(sql, (order_id,))
            order = cursor.fetchone()
        
        if order:
            return jsonify({"success": True, "order": order})
        else:
            return jsonify({"success": False, "message": "Order not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if connection:
            connection.close()

@app.route("/api/update_tracking", methods=["POST"])
@token_required
def update_tracking(current_user_id):
    data = request.json
    order_id = data.get("order_id")
    status = data.get("status")
    tracking_number = data.get("tracking_number")
    delivery_partner = data.get("delivery_partner")
    estimated_delivery = data.get("estimated_delivery")

    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = """
                UPDATE orders 
                SET status=%s, trackingNumber=%s, deliveryPartner=%s, estimatedDelivery=%s 
                WHERE id=%s
            """
            cursor.execute(sql, (status, tracking_number, delivery_partner, estimated_delivery, order_id))
        connection.commit()
        return jsonify({"success": True, "message": "Tracking updated successfully!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if connection:
            connection.close()

@app.route("/api/user_orders", methods=["GET"])
@token_required
def get_user_orders(current_user_id):
    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = "SELECT * FROM orders WHERE userId=%s ORDER BY createdAt DESC"
            cursor.execute(sql, (current_user_id,))
            orders = cursor.fetchall()
        return jsonify({"success": True, "orders": orders})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if connection:
            connection.close()

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    
    if not user_message:
        return jsonify({"success": False, "message": "Message is missing"}), 400
        
    try:
        # Define the system prompt/context for NatureMart
        system_context = """
        You are the NatureMart AI Assistant, a helpful and premium brand ambassador for NatureMart.
        NatureMart is an ultra-premium organic e-commerce platform specializing in:
        1. Fresh Organic Produce (Vegetables, Fruits, Grains).
        2. Luxury Organic Skincare (Aloe Vera, Argan Oil, Serums).
        3. Wellness Supplements (Matcha, Turmeric, Ashwagandha).
        4. Eco-friendly Lifestyle Products (Bamboo items, Jute bags).
        
        Your tone should be:
        - Professional, sophisticated, and premium.
        - Warm, helpful, and welcoming.
        - Enthusiastic about organic living and sustainability.
        - Concise but highly informative.
        
        Key Business Info:
        - Shipping: Express shipping on orders over $50.
        - Payment: M-Pesa, Credit Cards, PayPal.
        - Tracking: Users can track orders via the 'Track Order' page using their Order ID.
        - Support: Contact us at support@naturemart.com.
        
        Answer the user's question within this premium brand context.
        """
        
        response = gemini_model.generate_content(f"{system_context}\n\nUser Question: {user_message}")
        bot_response = response.text
        
        return jsonify({"success": True, "response": bot_response})
    except Exception as e:
        # Fallback to simple response if Gemini fails or API key is missing
        return jsonify({
            "success": True, 
            "response": "I'm currently in a limited mode, but I can tell you that NatureMart offers the finest organic products! How else can I assist you? 🌿"
        })

@app.route("/api/messages/send", methods=["POST"])
@token_required
def send_message(current_user_id):
    data = request.json
    receiver_id = data.get("receiver_id")
    message = data.get("message")
    
    if not receiver_id or not message:
        return jsonify({"success": False, "message": "Missing receiver_id or message"}), 400
        
    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = "INSERT INTO messages (sender_id, receiver_id, message) VALUES (%s, %s, %s)"
            cursor.execute(sql, (current_user_id, receiver_id, message))
        connection.commit()
        return jsonify({"success": True, "message": "Message sent!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if connection:
            connection.close()

@app.route("/api/messages/get/<int:other_user_id>", methods=["GET"])
@token_required
def get_messages(current_user_id, other_user_id):
    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = """
                SELECT * FROM messages 
                WHERE (sender_id=%s AND receiver_id=%s) 
                OR (sender_id=%s AND receiver_id=%s)
                ORDER BY createdAt ASC
            """
            cursor.execute(sql, (current_user_id, other_user_id, other_user_id, current_user_id))
            messages = cursor.fetchall()
            
            # Mark messages as read
            cursor.execute("UPDATE messages SET is_read=TRUE WHERE receiver_id=%s AND sender_id=%s", (current_user_id, other_user_id))
        connection.commit()
        return jsonify({"success": True, "messages": messages})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if connection:
            connection.close()

@app.route("/api/messages/conversations", methods=["GET"])
@token_required
def get_conversations(current_user_id):
    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = """
                SELECT DISTINCT u.id, u.name, u.email 
                FROM users u
                JOIN messages m ON (u.id = m.sender_id OR u.id = m.receiver_id)
                WHERE (m.sender_id = %s OR m.receiver_id = %s)
                AND u.id != %s
            """
            cursor.execute(sql, (current_user_id, current_user_id, current_user_id))
            conversations = cursor.fetchall()
        return jsonify({"success": True, "conversations": conversations})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", os.getenv("PORT", 5001)))
    app.run(debug=True, port=port)
