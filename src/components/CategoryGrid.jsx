import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: "Pure Skincare",
    count: "24 Products",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400",
    color: "from-emerald-500/20 to-lime-500/10",
    path: "/shop?category=Skincare"
  },
  {
    name: "Natural Wellness",
    count: "18 Products",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400",
    color: "from-lime-500/20 to-emerald-500/10",
    path: "/shop?category=Wellness"
  },
  {
    name: "Organic Living",
    count: "32 Products",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=400",
    color: "from-emerald-600/20 to-emerald-400/10",
    path: "/shop?category=Organic"
  }
];

export default function CategoryGrid() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">Shop by Category</h2>
          <p className="text-gray-500 font-light max-w-md">Explore our curated collections designed for every aspect of your organic lifestyle.</p>
        </div>
        <Link to="/shop" className="text-emerald-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:gap-4 transition-all">
          View All Categories <FiArrowRight />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link to={cat.path} className="group relative block h-[450px] rounded-[2.5rem] overflow-hidden border border-white/5">
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} group-hover:opacity-80 transition-opacity`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8">
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-2 block">{cat.count}</span>
                <h3 className="text-3xl font-bold text-white mb-4">{cat.name}</h3>
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <FiArrowRight size={20} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
