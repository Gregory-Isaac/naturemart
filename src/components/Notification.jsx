import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const addNotification = useCallback((message, type = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeNotification(id), 4000);
    }, [removeNotification]);

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <div className="fixed bottom-6 left-6 z-[10000] flex flex-col gap-3">
                <AnimatePresence>
                    {notifications.map((n) => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: -50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className={`glass-panel flex items-center gap-4 px-6 py-4 rounded-2xl min-w-[300px] border border-white/10 shadow-2xl ${
                                n.type === 'success' ? 'bg-emerald-500/10' : 'bg-blue-500/10'
                            }`}
                        >
                            <div className={n.type === 'success' ? 'text-emerald-500' : 'text-blue-500'}>
                                {n.type === 'success' ? <FiCheckCircle size={24} /> : <FiInfo size={24} />}
                            </div>
                            <p className="text-white text-sm font-medium flex-grow">{n.message}</p>
                            <button onClick={() => removeNotification(n.id)} className="text-gray-500 hover:text-white transition-colors">
                                <FiX size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
