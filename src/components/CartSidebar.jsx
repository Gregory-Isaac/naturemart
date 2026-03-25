import { motion } from "framer-motion";
import { useContext } from "react";
import { CartContext } from "../Context/CartContext";
import { Link } from "react-router-dom";

export default function CartSidebar({ cartOpen, setCartOpen }) {
  const { cartItems, removeFromCart } = useContext(CartContext);

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: cartOpen ? "0%" : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 w-96 h-full bg-black/90 dark:bg-brandGray shadow-2xl z-50 p-6 overflow-y-auto backdrop-blur-md"
    >
      {/* Close Button */}
      <button
        onClick={() => setCartOpen(false)}
        className="text-white text-xl mb-6 hover:text-red-500 transition"
      >
        ✖ Close
      </button>

      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-4">Your Cart</h2>

      {/* Empty Cart */}
      {cartItems.length === 0 && (
        <p className="text-gray-400">Your cart is empty.</p>
      )}

      {/* Cart Items */}
      <div className="space-y-4">
        {cartItems.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-4 bg-cardBg backdrop-blur-sm rounded-3xl shadow-glow"
          >
            <div>
              <h3 className="text-white font-semibold">{item.name}</h3>
              <p className="text-gray-300">${item.price}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 font-bold px-2 py-1 rounded-full hover:bg-red-500/20 transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      {cartItems.length > 0 && (
        <div className="mt-6 border-t border-white/20 pt-4">
          <p className="text-white text-lg font-bold">
            Subtotal: ${subtotal.toFixed(2)}
          </p>

          {/* Checkout Button */}
          <Link
            to="/checkout"
            className="block mt-4 w-full py-3 bg-gradient-to-r from-brandPurple via-brandPink to-brandRed rounded-3xl text-white font-bold text-center hover:opacity-90 transition"
            onClick={() => setCartOpen(false)}
          >
            Checkout
          </Link>
        </div>
      )}
    </motion.div>
  );
}