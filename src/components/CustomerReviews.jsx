import React from 'react';
import { motion } from 'framer-motion';
import './CustomerReviews.css';
import { FiStar } from 'react-icons/fi';

/**
 * Customer Reviews Component
 * Displays animated testimonials from happy customers
 */
const CustomerReviews = () => {
  const reviews = [
    {
      name: 'Sarah Mitchell',
      role: 'Wellness Enthusiast',
      image: '👩‍🦰',
      rating: 5,
      text: 'NatureMart has completely transformed my daily routine. Every product feels like pure magic!',
      color: 'from-purple-400 to-pink-400',
    },
    {
      name: 'James Chen',
      role: 'Sustainability Advocate',
      image: '👨‍💼',
      rating: 5,
      text: 'Finally a brand that cares about both quality and the environment. Absolutely enchanted!',
      color: 'from-emerald-400 to-cyan-400',
    },
    {
      name: 'Emma Johnson',
      role: 'Skincare Lover',
      image: '👩‍🦱',
      rating: 5,
      text: 'The aloe vera gel is a lifesaver. My skin has never felt better. Highly recommend!',
      color: 'from-rose-400 to-orange-400',
    },
  ];

  return (
    <div className="customer-reviews-container">
      <motion.div
        className="reviews-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2>✨ Enchanted by Our Customers ✨</h2>
        <p>Hear from those who've experienced the magic</p>
      </motion.div>

      <div className="reviews-grid">
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            className="review-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(167, 139, 250, 0.3)' }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
            }}
          >
            <div className={`review-header bg-gradient-to-r ${review.color}`}>
              <div className="review-avatar">{review.image}</div>
              <div className="review-info">
                <h4>{review.name}</h4>
                <p>{review.role}</p>
              </div>
            </div>

            <div className="review-stars">
              {[...Array(review.rating)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <FiStar fill="currentColor" />
                </motion.div>
              ))}
            </div>

            <p className="review-text">"{review.text}"</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;