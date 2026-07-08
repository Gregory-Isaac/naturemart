import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './FloatingFeatures.css';
import { FiStar, FiHeart, FiShare2, FiAward } from 'react-icons/fi';

/**
 * Floating Features Component
 * Displays enchanting feature cards that float and animate on scroll
 */
const FloatingFeatures = () => {
  const features = [
    {
      icon: <FiStar />,
      title: 'Premium Quality',
      description: 'Handpicked natural products with the highest standards',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <FiHeart />,
      title: 'Pure Love',
      description: 'Crafted with care and dedication to your wellness',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: <FiShare2 />,
      title: 'Easy Sharing',
      description: 'Share your favorites with friends and loved ones',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FiAward />,
      title: 'Award Winning',
      description: 'Recognized for excellence in natural products',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <div className="floating-features-container">
      <div className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="feature-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -15, scale: 1.05 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              type: 'spring',
              stiffness: 100,
            }}
          >
            <motion.div
              className={`feature-icon bg-gradient-to-br ${feature.color}`}
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            >
              {feature.icon}
            </motion.div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FloatingFeatures;