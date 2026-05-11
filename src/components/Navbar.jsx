import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { AnimatePresence, motion } from "framer-motion";
import { FiHeart, FiMenu, FiShoppingCart, FiUser, FiX } from "react-icons/fi";
import API from "../api/client";

export default function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Admin", path: "/admin" },
    { name: "Track", path: "/track" },
    { name: "Messages", path: "/messages" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080807]/86 backdrop-blur-2xl"
    >
      <div className="premium-shell py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tighter text-[var(--nm-ink)]">
          Nature<span className="text-gradient">Mart</span>
        </Link>

        <nav className="hidden lg:flex gap-1 items-center rounded-lg border border-white/10 bg-white/[0.035] p-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative rounded-md px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition-colors ${
                  isActive ? "text-[#080807]" : "text-[var(--nm-muted)] hover:text-[var(--nm-ink)]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute inset-0 rounded-md bg-[var(--nm-ink)]"
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="lg:hidden grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/[0.035] text-[var(--nm-muted)] hover:text-white transition-colors"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          {user ? (
            <Link to="/profile" className="p-2 text-[var(--nm-muted)] hover:text-white transition-colors" title="Profile">
              <div className="w-8 h-8 rounded-md bg-[var(--nm-ink)] flex items-center justify-center text-black text-xs font-black">
                {user.name?.[0] || "U"}
              </div>
            </Link>
          ) : (
            <Link to="/login" className="p-2 text-[var(--nm-muted)] hover:text-white transition-colors" title="Login">
              <FiUser size={20} />
            </Link>
          )}

          <Link to="/wishlist" className="relative p-2 text-[var(--nm-muted)] hover:text-white transition-colors" title="Wishlist">
            <FiHeart size={20} fill={wishlist.length > 0 ? "currentColor" : "none"} className={wishlist.length > 0 ? "text-red-500" : ""} />
            {wishlist.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full"
              >
                {wishlist.length}
              </motion.span>
            )}
          </Link>

          <Link to="/cart" className="relative p-2 text-[var(--nm-muted)] hover:text-white transition-colors" title="Cart">
            <FiShoppingCart size={20} />
            {cart.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 w-4 h-4 bg-[var(--nm-gold)] text-black text-[10px] font-bold flex items-center justify-center rounded-full"
              >
                {cart.length}
              </motion.span>
            )}
          </Link>

          <ConnectionStatus />
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden border-t border-white/10 bg-[#080807]/96 backdrop-blur-2xl"
          >
            <div className="premium-shell py-3 grid gap-2">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-md border px-4 py-3 text-sm font-black uppercase tracking-[0.12em] transition-colors ${
                      isActive
                        ? "border-transparent bg-[var(--nm-ink)] text-black"
                        : "border-white/10 bg-white/[0.035] text-[var(--nm-muted)]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function ConnectionStatus() {
  const [status, setStatus] = useState("checking");

  const checkStatus = async () => {
    try {
      const res = await API.get("/db_status");
      setStatus(res.data.success ? "online" : "offline");
    } catch (err) {
      setStatus("offline");
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 bg-white/[0.035] cursor-help group relative ml-2"
      title={`Database: ${status}`}
    >
      <div className={`w-2 h-2 rounded-full ${
        status === "online" ? "bg-[var(--nm-green)] animate-pulse" :
        status === "offline" ? "bg-red-500" : "bg-yellow-500 animate-bounce"
      }`} />
      <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--nm-muted)] group-hover:text-white transition-colors">
        {status === "online" ? "Connected" : status === "offline" ? "Offline" : "Checking"}
      </span>

      <div className="absolute top-full right-0 mt-2 p-2 bg-black/90 border border-white/10 rounded-lg text-[9px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 uppercase">
        Live Database Sync
      </div>
    </div>
  );
}
