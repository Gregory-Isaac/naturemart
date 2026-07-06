import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import formatPrice from "../utils/formatPrice";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiDollarSign,
  FiImage,
  FiLock,
  FiLogOut,
  FiPackage,
  FiPlus,
  FiTag,
  FiUploadCloud,
} from "react-icons/fi";
import API from "../api/client";
import { getImageUrl } from "../utils/imageUrl";
import useProducts from "../hooks/useProducts";

const ADMIN_PASSWORD = "4734";
const CATEGORIES = ["Skincare", "Lifestyle", "Supplements", "Wellness", "Organic", "General"];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "General",
  stock: "",
};

export default function AddProduct() {
  const fileRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem("naturemart_admin") === "true");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const { products, loading: loadingProducts, fetchProducts } = useProducts();
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("naturemart_admin", "true");
      setIsAdmin(true);
      setPassword("");
      setLoginError("");
      return;
    }
    setLoginError("Incorrect admin password.");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("naturemart_admin");
    setIsAdmin(false);
    setForm(emptyForm);
    setImage(null);
    setPreview("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (file) => {
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice(null);

    if (!form.name.trim() || !form.price) {
      setNotice({ type: "error", message: "Product name and price are required." });
      return;
    }

    setSaving(true);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      const res = await API.post("/add_product", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Admin-Password": ADMIN_PASSWORD,
        },
      });

      if (res.data.success) {
        setNotice({ type: "success", message: "Product added to NatureMart." });
        setForm(emptyForm);
        setImage(null);
        setPreview("");
        if (fileRef.current) fileRef.current.value = "";
        fetchProducts();
      } else {
        setNotice({ type: "error", message: res.data.message || "Failed to add product." });
      }
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Server error while adding product.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen px-6 py-24 flex items-center justify-center">
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass-panel rounded-2xl p-8"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center mb-6">
            <FiLock size={24} />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-gray-400 mb-8">Enter the admin password to manage NatureMart products.</p>

          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Admin Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-emerald-500/60 transition-all"
          />
          {loginError && <p className="mt-3 text-sm text-red-400">{loginError}</p>}

          <button
            type="submit"
            className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-black font-black flex items-center justify-center gap-2"
          >
            <FiLock />
            Unlock Dashboard
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pt-16 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4">
              <FiPackage />
              Product Management
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
              Admin <span className="text-gradient">Dashboard</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="self-start md:self-auto px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <FiLogOut />
            Lock Dashboard
          </button>
        </div>

        {notice && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 flex items-center gap-3 ${
              notice.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border-red-500/30 bg-red-500/10 text-red-200"
            }`}
          >
            {notice.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
            <span className="text-sm font-medium">{notice.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-5 glass-panel rounded-2xl p-6 space-y-5">
            <h2 className="text-xl font-black flex items-center gap-2">
              <FiPlus className="text-emerald-300" />
              Add Product
            </h2>

            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleImage(e.dataTransfer.files[0]);
              }}
              className="aspect-[4/3] rounded-xl border border-dashed border-white/15 bg-white/5 cursor-pointer overflow-hidden flex items-center justify-center"
            >
              {preview ? (
                <img src={preview} alt="Product preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-gray-500">
                  <FiUploadCloud size={38} className="mx-auto mb-3 text-emerald-300" />
                  <p className="text-sm font-semibold">Upload product image</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImage(e.target.files[0])}
              className="hidden"
            />

            <Field icon={<FiPackage />} label="Product Name" required>
              <input name="name" value={form.name} onChange={handleChange} className="admin-input" required />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field icon={<FiDollarSign />} label="Price" required>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="admin-input"
                  required
                />
              </Field>
              <Field icon={<FiPackage />} label="Stock">
                <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" className="admin-input" />
              </Field>
            </div>

            <Field icon={<FiTag />} label="Category">
              <select name="category" value={form.category} onChange={handleChange} className="admin-input">
                {CATEGORIES.map((category) => (
                  <option key={category} value={category} className="bg-[#111]">
                    {category}
                  </option>
                ))}
              </select>
            </Field>

            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="admin-input resize-none"
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-black font-black disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? "Saving..." : "Add Product"}
            </button>
          </form>

          <section className="lg:col-span-7 glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-black">Products</h2>
                <p className="text-sm text-gray-500">{products.length} items in the shop</p>
              </div>
              <button onClick={fetchProducts} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
                Refresh
              </button>
            </div>

            {loadingProducts ? (
              <div className="py-20 text-center text-gray-500">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center text-gray-500">No products yet.</div>
            ) : (
              <div className="space-y-3 max-h-[720px] overflow-y-auto pr-2">
                {products.map((product) => (
                  <div key={product.id || product._id || product.name} className="flex gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
                      {product.image ? (
                        <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <FiImage className="text-gray-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{product.description || "No description"}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400">
                        <span className="px-2 py-1 rounded-lg bg-white/5">{product.category || "General"}</span>
                        <span className="px-2 py-1 rounded-lg bg-white/5">{formatPrice(product.price)}</span>
                        <span className="px-2 py-1 rounded-lg bg-white/5">Stock: {product.stock || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, required, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
        {label}
        {required ? " *" : ""}
      </span>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>
        {children}
      </div>
    </label>
  );
}
