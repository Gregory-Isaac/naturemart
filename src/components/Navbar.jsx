import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="bg-black dark:bg-brandGray text-white px-6 py-4 flex justify-between items-center shadow-lg fixed w-full z-50">
      <h1 className="text-2xl font-bold cursor-pointer">NatureMart</h1>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search products..."
          className="px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        
        <button onClick={() => setDarkMode(!darkMode)} className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition">
          {darkMode ? "🌞" : "🌙"}
        </button>

        <button onClick={() => setCartOpen(!cartOpen)} className="relative">
          🛒
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded-full">3</span>
        </button>
      </div>
    </nav>
  );
}