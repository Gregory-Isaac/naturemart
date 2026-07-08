import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './EventCountdown.css';

/**
 * Event Countdown Component
 * Displays magical countdown timer for special events
 */
const EventCountdown = ({ targetDate = '2026-12-25' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const targetTime = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const CountdownUnit = ({ value, label }) => (
    <motion.div
      className="countdown-unit"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="countdown-value"
        key={value}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <div className="countdown-label">{label}</div>
    </motion.div>
  );

  return (
    <div className="event-countdown">
      <motion.div
        className="countdown-title"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        ✨ Special Event Countdown ✨
      </motion.div>
      <div className="countdown-container">
        <CountdownUnit value={timeLeft.days} label="Days" />
        <div className="countdown-separator">:</div>
        <CountdownUnit value={timeLeft.hours} label="Hours" />
        <div className="countdown-separator">:</div>
        <CountdownUnit value={timeLeft.minutes} label="Minutes" />
        <div className="countdown-separator">:</div>
        <CountdownUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
};

export default EventCountdown;