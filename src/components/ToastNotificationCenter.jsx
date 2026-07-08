import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ToastNotificationCenter.css';

/**
 * Toast Notification Center
 * Global notification management system
 */
const ToastNotificationCenter = ({ notifications = [] }) => {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className={`toast ${notification.type}`}
            initial={{ opacity: 0, x: 400, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <div className="toast-content">
              <span className="toast-icon">{notification.icon}</span>
              <span className="toast-message">{notification.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotificationCenter;