import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, iconSize = 40, kicker, heading, description, linkTo, linkLabel, linkIcon: LinkIcon }) {
  return (
    <div className="premium-page min-h-[80vh] flex items-center justify-center px-6 py-24 text-center">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="premium-card premium-veil max-w-xl p-10">
        <div className="relative z-10">
          <div className="mx-auto mb-8 grid h-24 w-24 place-items-center rounded-lg border border-white/10 bg-white/5 text-[var(--nm-gold)]">
            <Icon size={iconSize} />
          </div>
          {kicker && <span className="premium-kicker mb-4">{kicker}</span>}
          <h2 className="premium-heading text-4xl md:text-5xl mb-5">{heading}</h2>
          <p className="premium-muted mb-9">{description}</p>
          {linkTo && (
            <Link to={linkTo} className="premium-button premium-button-primary">
              {LinkIcon && <LinkIcon />}
              {linkLabel}
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
