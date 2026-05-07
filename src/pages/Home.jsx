import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Carousel from "../components/Carousel";
import CategoryGrid from "../components/CategoryGrid";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-32">
      {/* Abstract Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-lime-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        <div className="flex flex-col items-start text-left">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="px-4 py-2 rounded-full glass border border-white/10 mb-8 inline-block"
          >
            <span className="text-lime-400 text-sm font-semibold tracking-wider uppercase">
              NatureMart 
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6"
          >
            Purity <br/>
            <span className="text-gradient">Redefined.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-xl text-gray-400 max-w-lg mb-10 leading-relaxed font-light"
          >
            Experience the absolute pinnacle of organic lifestyle. Curated essentials crafted with uncompromising quality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex gap-4"
          >
            <Link
              to="/shop"
              className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden flex items-center gap-2 transition-transform hover:scale-105"
            >
              <span className="relative z-10">Explore Collection</span>
              <FiArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-lime-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative lg:h-[600px] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-lime-500/5 rounded-[3rem] transform rotate-3 scale-105 glass border border-white/5" />
          <Carousel />
        </motion.div>

      </div>
      
      <CategoryGrid />
    </div>
  );
}