import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ScrollProgress.css';

/**
 * Scroll Progress Indicator
 * Shows reading progress with enchanting animation
 */
const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="scroll-progress-bar"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: scrollProgress / 100 }}
      style={{ transformOrigin: 'left' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    />
  );
};

export default ScrollProgress;