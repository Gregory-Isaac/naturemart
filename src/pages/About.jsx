import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiHeart, FiShield } from 'react-icons/fi';

export default function About() {
  const values = [
    { icon: FiHeart, title: "Purity First", description: "Every product is sourced from certified organic farms with zero compromises on quality." },
    { icon: FiTarget, title: "Sustainability", description: "Our packaging is 100% recyclable, and our carbon footprint is monitored daily." },
    { icon: FiShield, title: "Transparency", description: "We believe in full disclosure. You know exactly what goes into every bottle and box." }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-lime-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
              Crafting a <span className="text-gradient">Greener</span> Future.
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed font-light mb-8">
              NatureMart was born from a simple belief: that nature provides everything we need to thrive. We are on a mission to curate the world's finest organic essentials, making sustainable living the new standard of luxury.
            </p>
            <div className="flex gap-12">
              <div>
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-gray-500 text-sm">Organic</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">50k+</p>
                <p className="text-gray-500 text-sm">Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">24/7</p>
                <p className="text-gray-500 text-sm">Support</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 glass shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop" 
                alt="Nature" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="glass-panel p-10 rounded-[2.5rem] border border-white/5 hover:border-lime-500/30 transition-colors group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-lime-500 rounded-2xl flex items-center justify-center mb-6 text-black shadow-lg shadow-emerald-500/10 group-hover:shadow-emerald-500/30 transition-shadow">
                <v.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{v.title}</h3>
              <p className="text-gray-400 leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
