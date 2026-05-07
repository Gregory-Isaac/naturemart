import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiHelpCircle } from 'react-icons/fi';

const faqs = [
  {
    question: "How long does shipping take?",
    answer: "Our standard organic shipping takes 3-5 business days. Express shipping options are available at checkout for 1-2 day delivery."
  },
  {
    question: "Are all your products 100% organic?",
    answer: "Yes! Every single item in the NatureMart collection is certified organic and sourced from sustainable, ethical farms."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is placed, you'll receive an Order ID. You can enter this ID on our 'Track Order' page to see its real-time status."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we ship within the continent Africa and selected regions in Kenya. We're working on expanding our organic reach globally!"
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day purity guarantee. If you're not completely satisfied with your purchase, you can return it for a full refund or exchange."
  }
];

const FAQItem = ({ faq, isOpen, toggle }) => {
  return (
    <div className="border-b border-white/5 mb-4 last:border-0">
      <button 
        onClick={toggle}
        className="w-full py-6 flex items-center justify-between text-left hover:text-emerald-400 transition-colors group"
      >
        <span className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{faq.question}</span>
        <div className={`p-2 rounded-full glass transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : 'text-gray-500'}`}>
          {isOpen ? <FiMinus /> : <FiPlus />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-400 leading-relaxed font-light">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-500 mx-auto mb-6 flex items-center justify-center text-black shadow-xl shadow-emerald-500/20"
          >
            <FiHelpCircle size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black tracking-tighter text-white mb-4"
          >
            Got <span className="text-gradient">Questions?</span>
          </motion.h1>
          <p className="text-gray-500 font-light text-lg">Find answers to the most common inquiries about the NatureMart experience.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl"
        >
          {faqs.map((faq, idx) => (
            <FAQItem 
              key={idx} 
              faq={faq} 
              isOpen={openIndex === idx} 
              toggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            />
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">Still need help?</p>
          <Link to="/contact" className="text-white font-bold border-b-2 border-emerald-500 pb-1 hover:text-emerald-500 transition-colors">
            Reach out to our support team
          </Link>
        </div>
      </div>
    </div>
  );
}

// Simple internal link component to avoid import issues in this scratchpad
const Link = ({ to, children, className }) => (
  <a href={to} className={className}>{children}</a>
);
