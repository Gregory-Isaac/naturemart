import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "../api/client";
import { FiPhone, FiCreditCard, FiCheckCircle } from "react-icons/fi";

export default function Checkout() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await API.post("/mpesa_payment", { phone, amount: 1 });
      if (res.data.success) {
        setStatus({ type: 'success', message: res.data.message });
      } else {
        setStatus({ type: 'error', message: res.data.message });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "Payment initiation failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 glass-panel p-10 rounded-[2rem]"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <FiCreditCard size={32} className="text-black" />
          </div>
          <h2 className="text-3xl font-black mb-2 text-white">Checkout</h2>
          <p className="text-gray-400 text-sm">Complete your purchase with M-Pesa</p>
        </div>

        {status && (
          <div className={`p-4 rounded-xl mb-6 text-sm border ${
            status.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}>
            <div className="flex items-center gap-3">
              {status.type === 'success' && <FiCheckCircle />}
              <p>{status.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">M-Pesa Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="2547XXXXXXXX"
                className="w-full bg-[#111] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-lime-500/50 transition-colors"
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-2 px-1">Format: 254712345678</p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white">$15.99</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
              <span className="text-white">Total</span>
              <span className="text-lime-400">$15.99</span>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 text-black font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex justify-center items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Pay with M-Pesa"
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-[10px] mt-6 px-6">
          By clicking pay, you will receive an STK push on your phone. Please enter your M-Pesa PIN to complete the transaction.
        </p>
      </motion.div>
    </div>
  );
}