import { motion } from "framer-motion";

export default function ProductCard({ name, price }) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.03, boxShadow: "0 0 40px rgba(255,255,255,0.2)" }}
      className="bg-cardBg backdrop-blur-md border border-cardBorder p-6 rounded-4xl shadow-premium transition"
    >
      <div className="h-40 bg-gray-700 rounded-3xl mb-4"></div>
      <h3 className="text-lg font-bold text-white">{name}</h3>
      <p className="text-gray-300">${price}</p>
      <button className="mt-4 px-4 py-2 bg-gradient-to-r from-brandPurple via-brandPink to-brandRed rounded-3xl hover:opacity-90 transition text-white font-semibold">
        Add to Cart
      </button>
    </motion.div>
  );
}