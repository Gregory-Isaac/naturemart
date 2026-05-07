import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import aloeImg from '../images/aloe_vera_gel.png';
import bambooImg from '../images/bamboo_toothbrush.png';
import lavenderImg from '../images/lavender_oil.png';

const slides = [
    {
        id: 1,
        title: "Pure Aloe Vera Gel",
        subtitle: "Hydrating & Healing",
        image: aloeImg,
        color: "from-emerald-500/20 to-teal-500/20"
    },
    {
        id: 2,
        title: "Bamboo Toothbrush",
        subtitle: "Eco-friendly Dental Care",
        image: bambooImg,
        color: "from-lime-500/20 to-emerald-500/20"
    },
    {
        id: 3,
        title: "Lavender Oil",
        subtitle: "100% Pure Essential Oil",
        image: lavenderImg,
        color: "from-purple-500/20 to-indigo-500/20"
    }
];

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9
        })
    };

    return (
        <div className="relative w-full h-full min-h-[400px] rounded-[3rem] overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.4 }
                    }}
                    className="absolute inset-0 flex flex-col"
                >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentIndex].color} opacity-40`} />
                    
                    {/* Image Container */}
                    <div className="relative flex-grow flex items-center justify-center p-8">
                        <motion.img
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            src={slides[currentIndex].image}
                            alt={slides[currentIndex].title}
                            className="max-h-[250px] object-contain drop-shadow-2xl"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="relative p-8 pt-0 text-center">
                        <motion.span
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-lime-400 font-medium uppercase tracking-[0.2em] text-[10px] mb-2 block"
                        >
                            Featured Product
                        </motion.span>
                        <motion.h3
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl font-bold text-white mb-2"
                        >
                            {slides[currentIndex].title}
                        </motion.h3>
                        <motion.p
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-gray-400 text-sm font-light"
                        >
                            {slides[currentIndex].subtitle}
                        </motion.p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                <button
                    onClick={prevSlide}
                    className="p-3 rounded-full glass border border-white/10 text-white pointer-events-auto hover:bg-white/10 transition-colors"
                >
                    <FiChevronLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-3 rounded-full glass border border-white/10 text-white pointer-events-auto hover:bg-white/10 transition-colors"
                >
                    <FiChevronRight size={24} />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentIndex ? 'w-8 bg-lime-500' : 'w-2 bg-white/20'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
