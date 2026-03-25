import { motion } from "framer-motion";

const slides = [
  { title: "Ultra Premium Deals", gradient: "bg-gradient-to-r from-brandPurple via-brandPink to-brandRed" },
  { title: "Fast Delivery Nationwide", gradient: "bg-gradient-to-r from-brandBlue via-brandPurple to-brandPink" },
  { title: "Fresh & Organic Products", gradient: "bg-gradient-to-r from-green-400 via-yellow-400 to-red-400" },
];

export default function HeroCarousel() {
  return (
    <div className="h-[80vh] flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide relative">
      {slides.map((slide, i) => (
        <motion.div
          key={i}
          className={`snap-start flex-shrink-0 w-full h-full flex justify-center items-center ${slide.gradient} text-white text-6xl md:text-7xl font-display relative`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: i * 0.5 }}
        >
          {slide.title}
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl -z-10"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </motion.div>
      ))}
    </div>
  );
}