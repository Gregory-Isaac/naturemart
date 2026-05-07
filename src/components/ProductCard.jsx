import React from 'react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { FiPlus, FiHeart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from './Notification';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addNotification } = useNotification();

  const handleAddToCart = () => {
    addToCart(product);
    addNotification(`${product.name} added to cart! 🛒`);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
    const isNowIn = !isInWishlist(product.id);
    addNotification(isNowIn ? `Added to wishlist! ❤️` : `Removed from wishlist! 💔`, isNowIn ? 'success' : 'info');
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="glass-panel rounded-2xl overflow-hidden group flex flex-col h-full"
    >
      <div className="relative overflow-hidden aspect-square bg-[#111]">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleWishlist}
          className={`absolute top-4 right-4 p-2 rounded-full glass border border-white/10 z-20 transition-colors ${
            isInWishlist(product.id) ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FiHeart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
        </motion.button>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-semibold text-lime-400 tracking-wider uppercase mb-1 block">
              {product.category}
            </span>
            <h3 className="text-lg font-bold text-white leading-tight">
              {product.name}
            </h3>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-light text-white">
            ${product.price.toFixed(2)}
          </span>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 flex items-center justify-center text-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-shadow"
          >
            <FiPlus size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}