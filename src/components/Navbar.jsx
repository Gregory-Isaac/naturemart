import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { motion } from "framer-motion";
import { FiShoppingCart, FiUser, FiLogOut, FiMessageSquare, FiHeart } from "react-icons/fi";

export default function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Track Order", path: "/track" },
    { name: "Messages", path: "/messages" },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full glass"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tighter">
          Nature<span className="text-gradient">Mart</span>
        </Link>

        <nav className="hidden md:flex gap-8 items-center">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path}
                className="relative text-sm font-medium transition-colors hover:text-white"
                style={{ color: isActive ? '#f3f4f6' : '#9ca3af' }}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex gap-4 items-center">
          {user ? (
            <Link to="/profile" className="p-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2" title="Profile">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-lime-500 flex items-center justify-center text-black text-xs font-bold">
                {user.name[0]}
              </div>
            </Link>
          ) : (
            <Link to="/login" className="p-2 text-gray-400 hover:text-white transition-colors" title="Login">
              <FiUser size={20} />
            </Link>
          )}
          
          <Link to="/wishlist" className="relative p-2 text-gray-400 hover:text-white transition-colors">
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

          <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <FiShoppingCart size={20} />
            {cart.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 w-4 h-4 bg-lime-500 text-black text-[10px] font-bold flex items-center justify-center rounded-full"
              >
                {cart.length}
              </motion.span>
            )}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}