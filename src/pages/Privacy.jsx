import React      from 'react';
import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div className="min-h-screen pt-24 pb-20 relative px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">Privacy <span className="text-gradient">& Terms</span></h1>
          <p className="text-gray-400">Last updated: May 2026</p>
        </motion.div>

        <div className="glass-panel p-10 md:p-16 rounded-[2.5rem] border border-white/5 prose prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">1. Introduction</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Welcome to NatureMart. Your privacy is critically important to us. This document outlines how we collect, use, and safeguard your personal information when you use our platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">2. Data Collection</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We collect information you provide directly to us, such as when you create an account, make a purchase, or contact support. This may include your name, email, shipping address, and payment details.
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Account information (email, password)</li>
              <li>Transaction details</li>
              <li>Communication history</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">3. Use of Information</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We use the collected data to process your orders, improve our services, and communicate with you about your account and latest offers. We do not sell your personal data to third parties.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">4. Security</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We implement industry-standard security measures, including SSL encryption and JWT authentication, to protect your data from unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">5. Contact Us</h2>
            <p className="text-gray-400 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at <span className="text-lime-400">privacy@naturemart.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
