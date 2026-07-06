import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';
import API from '../api/client';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your NatureMart assistant. How can I help you today? 🌿", sender: 'bot' }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await API.post('/chat', { message: input });
            const data = response.data;
            
            if (data.success) {
                setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
            } else {
                setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting. 😔", sender: 'bot' }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { text: "Connection error. Please try again later.", sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="glass-panel w-80 sm:w-96 h-[500px] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                    >
                        {/* Header */}
                        <div className="p-5 flex items-center justify-between bg-gradient-to-r from-emerald-600/20 to-lime-600/20 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-lime-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <FiMessageCircle className="text-white text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm tracking-tight">NatureMart Support</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                                    <FiMinimize2 size={18} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                                    <FiX size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-grow overflow-y-auto p-5 space-y-4 scroll-smooth">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div 
                                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                            msg.sender === 'user' 
                                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-tr-none shadow-lg' 
                                            : 'glass border border-white/5 text-gray-200 rounded-tl-none'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="glass border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none">
                                        <div className="flex gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 bg-black/40 border-t border-white/5">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-5 pr-12 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-500"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!input.trim()}
                                    className="absolute right-1.5 p-2 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-full text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                >
                                    <FiSend size={18} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.button
                        key="fab"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-lime-500 text-white shadow-2xl shadow-emerald-500/20 flex items-center justify-center border border-white/20"
                    >
                        <FiMessageCircle size={32} />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-[#0a0a0a] rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;
