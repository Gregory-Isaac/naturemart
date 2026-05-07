import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen pt-12 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-4"
          >
            Your <span className="text-red-500">Wishlist</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg font-light max-w-2xl"
          >
            A curated space for the products you love. Save your favorites and come back to them anytime.
          </motion.p>
        </div>

        {wishlist.length > 0 ? (
          <motion.div 
            variants={container} 
            initial="hidden" 
            animate="show" 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {wishlist.map(p => (
              <motion.div variants={item} key={p.id}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 glass rounded-[3rem] border border-white/5 text-center px-6"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-gray-700 mb-8">
              <FiHeart size={48} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Your wishlist is empty</h3>
            <p className="text-gray-500 max-w-sm mb-10 font-light">
              Seems like you haven't saved any organic treasures yet. Explore our shop and find something special!
            </p>
            <Link 
              to="/shop" 
              className="px-10 py-4 bg-white text-black font-bold rounded-full flex items-center gap-3 hover:scale-105 transition-transform"
            >
              <FiShoppingBag />
              Go to Shop
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
