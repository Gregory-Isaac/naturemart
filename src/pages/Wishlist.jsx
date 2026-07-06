import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { staggerContainer, staggerItem } from '../utils/animations';
import EmptyState from '../components/EmptyState';

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
            variants={staggerContainer} 
            initial="hidden" 
            animate="show" 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {wishlist.map(p => (
              <motion.div variants={staggerItem} key={p.id}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            icon={FiHeart}
            iconSize={48}
            heading="Your wishlist is empty"
            description="Seems like you haven't saved any organic treasures yet. Explore our shop and find something special!"
            linkTo="/shop"
            linkLabel="Go to Shop"
            linkIcon={FiShoppingBag}
          />
        )}
      </div>
    </div>
  );
}
