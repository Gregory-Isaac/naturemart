"""Unit tests for Backend.py — covers helper functions and API endpoints."""
import os
import sys
import json
import uuid
import pytest

# Ensure the repo root is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# Force local SQLite mode before importing Backend
os.environ["LOCAL_DB"] = "true"

import Backend  # noqa: E402


def _unique_email():
    return f"test-{uuid.uuid4().hex[:8]}@example.com"


@pytest.fixture()
def client():
    Backend.app.config["TESTING"] = True
    with Backend.app.test_client() as c:
        yield c


# ── normalize_mpesa_phone ─────────────────────────────────────────────────────

class TestNormalizeMpesaPhone:
    def test_valid_07_format(self):
        assert Backend.normalize_mpesa_phone("0712345678") == "254712345678"

    def test_valid_01_format(self):
        assert Backend.normalize_mpesa_phone("0112345678") == "254112345678"

    def test_valid_254_prefix(self):
        assert Backend.normalize_mpesa_phone("254712345678") == "254712345678"

    def test_valid_7_digit_start(self):
        assert Backend.normalize_mpesa_phone("712345678") == "254712345678"

    def test_valid_1_digit_start(self):
        assert Backend.normalize_mpesa_phone("112345678") == "254112345678"

    def test_strips_non_digits(self):
        assert Backend.normalize_mpesa_phone("+254-712-345-678") == "254712345678"

    def test_too_short(self):
        assert Backend.normalize_mpesa_phone("07123") is None

    def test_too_long(self):
        assert Backend.normalize_mpesa_phone("25471234567890") is None

    def test_empty_string(self):
        assert Backend.normalize_mpesa_phone("") is None

    def test_none_input(self):
        assert Backend.normalize_mpesa_phone(None) is None

    def test_non_safaricom_prefix(self):
        assert Backend.normalize_mpesa_phone("0312345678") is None

    def test_letters_input(self):
        assert Backend.normalize_mpesa_phone("abcdefghij") is None


# ── /api/db_status ────────────────────────────────────────────────────────────

class TestDbStatus:
    def test_returns_success(self, client):
        resp = client.get("/api/db_status")
        data = resp.get_json()
        assert resp.status_code == 200
        assert data["success"] is True
        assert "Local" in data["mode"]


# ── /api/signup & /api/signin ─────────────────────────────────────────────────

class TestAuth:
    def test_signup_missing_fields(self, client):
        resp = client.post("/api/signup", json={"name": "A"})
        assert resp.status_code == 400

    def test_signup_and_signin_flow(self, client):
        email = _unique_email()
        payload = {"name": "Test", "email": email, "password": "pass123"}
        resp = client.post("/api/signup", json=payload)
        data = resp.get_json()
        assert data["success"] is True

        resp2 = client.post("/api/signin", json={"email": email, "password": "pass123"})
        data2 = resp2.get_json()
        assert data2["success"] is True
        assert "token" in data2

    def test_signup_duplicate_email(self, client):
        email = _unique_email()
        payload = {"name": "A", "email": email, "password": "pw"}
        client.post("/api/signup", json=payload)
        resp = client.post("/api/signup", json=payload)
        assert resp.status_code == 400
        assert resp.get_json()["success"] is False

    def test_signin_missing_fields(self, client):
        resp = client.post("/api/signin", json={"email": "a@b.com"})
        assert resp.status_code == 400

    def test_signin_wrong_password(self, client):
        email = _unique_email()
        payload = {"name": "B", "email": email, "password": "correct"}
        client.post("/api/signup", json=payload)
        resp = client.post("/api/signin", json={"email": email, "password": "wrong"})
        assert resp.status_code == 401


# ── /api/get_products & /api/add_product ──────────────────────────────────────

class TestProducts:
    def test_get_products_returns_list(self, client):
        resp = client.get("/api/get_products")
        assert resp.status_code == 200
        assert isinstance(resp.get_json(), list)

    def test_add_product_requires_admin_password(self, client):
        resp = client.post("/api/add_product", data={"name": "X", "price": "10"})
        assert resp.status_code == 401

    def test_add_product_with_valid_admin(self, client):
        resp = client.post(
            "/api/add_product",
            data={"name": "Organic Item", "price": "25", "category": "Wellness"},
            headers={"X-Admin-Password": Backend.app.config["ADMIN_PASSWORD"]},
        )
        data = resp.get_json()
        assert data["success"] is True


# ── /api/track_order ──────────────────────────────────────────────────────────

class TestTracking:
    def test_track_nonexistent_order(self, client):
        resp = client.get("/api/track_order/99999")
        assert resp.status_code == 404

    def test_track_existing_order(self, client):
        conn = Backend.get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO orders (userId, status) VALUES (%s, %s)",
                (1, "shipped"),
            )
        conn.commit()
        resp = client.get("/api/track_order/1")
        data = resp.get_json()
        assert data["success"] is True
        assert data["order"]["status"] == "shipped"


# ── /api/chat ─────────────────────────────────────────────────────────────────

class TestChat:
    def test_chat_missing_message(self, client):
        resp = client.post("/api/chat", json={"message": ""})
        assert resp.status_code == 400

    def test_chat_returns_response(self, client):
        resp = client.post("/api/chat", json={"message": "hello"})
        data = resp.get_json()
        assert data["success"] is True
        assert "response" in data


# ── /api/mpesa_callback ──────────────────────────────────────────────────────

class TestMpesaCallback:
    def test_callback_returns_success(self, client):
        resp = client.post("/api/mpesa_callback", json={})
        assert resp.status_code == 200
        assert resp.get_json()["success"] is True
