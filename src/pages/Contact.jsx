import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 relative px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tighter"
          >
            Let's <span className="text-gradient">Connect.</span>
          </motion.h1>
          <p className="text-xl text-gray-400 mb-12 font-light">
            Have a question about our products or want to partner with us? We'd love to hear from you.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-lime-500/50 transition-colors">
                <FiMail className="text-lime-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Email Us</p>
                <p className="text-white">gregoryisaac473@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-lime-500/50 transition-colors">
                <FiPhone className="text-lime-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Call Us</p>
                <p className="text-white">+254 708 352 076</p>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-lime-500/50 transition-colors">
                <FiMapPin className="text-lime-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Location</p>
                <p className="text-white">Nairobi, Kenya</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-10 rounded-[2.5rem] border border-white/10"
        >
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <FiSend className="text-emerald-400 text-3xl animate-bounce" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Message Sent!</h2>
              <p className="text-gray-400">Our team will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Name</label>
                  <input type="text" required className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500/50" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input type="email" required className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Subject</label>
                <input type="text" required className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Message</label>
                <textarea rows="4" required className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500/50 resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 text-black font-bold py-4 rounded-xl hover:opacity-90 transition-opacity">
                Send Message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
