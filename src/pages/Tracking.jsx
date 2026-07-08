import React, { useState } from 'react';
import { motion } from 'framer-motion';
import API from '../api/client';
import { FiPackage, FiTruck, FiCheck, FiSearch, FiClock } from 'react-icons/fi';

const statuses = [
  { id: 'pending', label: 'Order Placed', icon: FiPackage },
  { id: 'processed', label: 'Processing', icon: FiClock },
  { id: 'shipped', label: 'Shipped', icon: FiTruck },
  { id: 'delivered', label: 'Delivered', icon: FiCheck },
];

export default function Tracking() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId) return;
    setLoading(true);
    setError('');
    try {
      const res = await API.get(`/track_order/${orderId}`);
      if (res.data.success) {
        setOrder(res.data.order);
      } else {
        setError(res.data.message);
        setOrder(null);
      }
    } catch (err) {
      setError("Could not find order. Please check the ID.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    return statuses.findIndex(s => s.id === status.toLowerCase());
  };

  return (
    <div className="min-h-screen pt-24 pb-20 relative px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
          >
            Track Your <span className="text-gradient">Order</span>
          </motion.h1>
          <p className="text-gray-400">Enter your order ID to see real-time delivery status</p>
        </div>

        <form onSubmit={handleTrack} className="flex gap-4 max-w-lg mx-auto mb-16">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text"
              placeholder="Order ID (e.g., 1)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-lime-500/50 transition-colors"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-white text-black font-bold px-8 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-2xl text-center mb-10"
          >
            {error}
          </motion.div>
        )}

        {order && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 md:p-12 rounded-[2.5rem]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div>
                <p className="text-xs font-semibold text-lime-400 uppercase tracking-widest mb-2">Order Information</p>
                <h3 className="text-2xl font-bold text-white mb-4">#NM-{order.id.toString().padStart(4, '0')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-400">
                    <FiClock className="text-lime-500" />
                    <span>Placed on: {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <FiPackage className="text-lime-500" />
                    <span>Status: <span className="text-white capitalize">{order.status}</span></span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Delivery Details</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Partner</p>
                    <p className="text-white font-medium">{order.deliveryPartner || 'Pending Assignment'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Est. Delivery</p>
                    <p className="text-white font-medium">{order.estimatedDelivery || 'Calculating...'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-emerald-500 to-lime-500 -translate-y-1/2 transition-all duration-1000" 
                style={{ width: `${(getStatusIndex(order.status) / (statuses.length - 1)) * 100}%` }}
              />
              
              <div className="relative flex justify-between">
                {statuses.map((s, idx) => {
                  const isActive = idx <= getStatusIndex(order.status);
                  const Icon = s.icon;
                  return (
                    <div key={s.id} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 transition-colors duration-500 ${
                        isActive ? 'bg-lime-500 text-black shadow-lg shadow-lime-500/20' : 'bg-[#1a1a1a] text-gray-600 border border-white/5'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <p className={`mt-4 text-xs font-semibold uppercase tracking-tighter transition-colors duration-500 ${
                        isActive ? 'text-white' : 'text-gray-600'
                      }`}>
                        {s.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
