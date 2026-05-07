import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiPackage, FiSettings, FiLogOut, FiMail, FiPhone, FiCalendar, FiClock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../api/client';

export default function Profile() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/user_orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders", error);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 rounded-[2.5rem] border border-white/5 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-lime-500 mx-auto mb-6 flex items-center justify-center text-3xl font-black text-black shadow-xl shadow-emerald-500/20">
              {user.name[0]}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-gray-500 text-sm font-light mb-8">{user.email}</p>
            
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-emerald-500 text-black font-bold' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                <FiPackage size={20} />
                Order History
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'settings' ? 'bg-emerald-500 text-black font-bold' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                <FiSettings size={20} />
                Account Settings
              </button>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all mt-4"
              >
                <FiLogOut size={20} />
                Logout
              </button>
            </div>
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'orders' ? (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white">Order History</h1>
                    <p className="text-gray-500 font-light mt-2">Manage and track your recent organic purchases.</p>
                  </div>
                  <div className="bg-white/5 px-4 py-2 rounded-full border border-white/5 text-xs text-gray-400">
                    {orders.length} Total Orders
                  </div>
                </div>

                {loading ? (
                  <div className="py-20 text-center text-gray-500">Loading orders...</div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500">
                              <FiPackage size={24} />
                            </div>
                            <div>
                              <h4 className="text-white font-bold">Order #{order.trackingNumber || order.id}</h4>
                              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                <span className="flex items-center gap-1"><FiCalendar size={12}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><FiClock size={12}/> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Status</p>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-500' : 
                                order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' : 'bg-amber-500/20 text-amber-500'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total</p>
                              <p className="text-xl font-bold text-white">${Number(order.total).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center glass rounded-3xl border border-white/5">
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h1 className="text-4xl font-black tracking-tighter text-white">Account Settings</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel p-8 rounded-[2rem] border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                      <FiUser className="text-emerald-500" /> Personal Information
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">Full Name</label>
                        <p className="text-white bg-white/5 p-4 rounded-xl border border-white/5">{user.name}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">Email Address</label>
                        <p className="text-white bg-white/5 p-4 rounded-xl border border-white/5">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-8 rounded-[2rem] border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                      <FiSettings className="text-emerald-500" /> Contact Details
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">Phone Number</label>
                        <p className="text-white bg-white/5 p-4 rounded-xl border border-white/5">{user.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">Default Address</label>
                        <p className="text-gray-500 italic bg-white/5 p-4 rounded-xl border border-white/5 border-dashed">No address saved yet.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
