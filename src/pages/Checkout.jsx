import React   ,                                                                                   { useState } from "react";
import { motion }                                                                               from "framer-motion";
import API                                                                                     from "../api/client";
import { FiArrowRight, FiCheckCircle, FiChevronLeft, FiClock, FiLock, FiPhone, FiShield, FiTruck } from "react-icons/fi";
import { useCart }                                                                             from "../context/CartContext";
import { Link, useNavigate }                                                                   from "react-router-dom";
import { getImageUrl, handleImageFallback }                                                    from "../utils/imageUrl";
import { calculateOrderTotals }                                                                 from "../utils/cartCalculations";

export default function Checkout() {
  const { cart, clearCart }   = useCart();
  const navigate              = useNavigate();
  const [phone, setPhone]     = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState(null);

  const { subtotal, shipping, tax, total } = calculateOrderTotals(cart);

  const normalizePhone = (value) => {
    const digits = value.replace(/\D/g, "");

    if (/^254(7|1)\d{8}$/.test(digits)) return digits;
    if (/^0(7|1)\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
    if (/^(7|1)\d{8}$/.test(digits)) return `254${digits}`;

    return "";
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      setStatus({ type: 'error', message: "Enter a valid Safaricom number, for example 0712345678 or 254712345678." });
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const res = await API.post("/mpesa_payment", { phone: normalizedPhone, amount: Math.round(total) });
      if (res.data.success) {
        setStatus({ type: 'success', message: "Payment request sent! Please check your phone." });
        setTimeout(() => {
          clearCart();
          navigate('/profile');
        }, 5000);
      } else {
        setStatus({ type: 'error', message: res.data.message });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || "Payment initiation failed. Please verify your number and try again."
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !status) {
    return (
      <div  className = "premium-page min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div  className = "premium-card premium-veil max-w-lg p-10">
      <div  className = "relative z-10">
      <FiLock className = "mx-auto mb-6 text-[var(--nm-gold)]" size = {42} />
      <h1   className = "premium-heading text-4xl mb-4">Nothing to checkout</h1>
      <p    className = "premium-muted mb-8">Your cart is empty. Add a few reserve essentials before starting payment.</p>
      <Link to        = "/shop" className = "premium-button premium-button-primary">Back to Shop</Link>
      </div>
      </div>
      </div>
    );
  }

  return (
    <div  className = "premium-page pt-20 pb-32">
    <div  className = "premium-shell">
    <Link to        = "/cart" className = "inline-flex items-center gap-2 text-[var(--nm-muted)] hover:text-[var(--nm-gold)] mb-12 transition-colors">
          <FiChevronLeft /> Back to Cart
        </Link>

        <div className = "grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Form */}
          <motion.div
            initial   = {{ opacity: 0, x: -20 }}
            animate   = {{ opacity: 1, x: 0 }}
            className = "space-y-8"
          >
            <div>
              <span className = "premium-kicker">Secure Payment</span>
              <h1 className = "premium-heading text-4xl md:text-5xl mt-4 mb-4">Secure <span className = "text-gradient">Checkout</span></h1>
              <p  className = "premium-muted">Complete your transaction via M-Pesa secure gateway.</p>
            </div>

            <div className = "glass-panel p-8 rounded-lg relative overflow-hidden">
            <div className = "absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px]" />
              
              <div    className = "flex items-center gap-4 mb-10">
              <div    className = "w-12 h-12 bg-white/5 rounded-md flex items-center justify-center text-[var(--nm-gold)]">
              <FiLock size      = {24} />
                </div>
                <div>
                  <h3 className = "font-bold text-white">Encrypted Transaction</h3>
                  <p  className = "text-xs text-[var(--nm-muted)]">Your payment data is protected by industry-standard SSL.</p>
                </div>
              </div>

              {status && (
                <motion.div 
                  initial   = {{ opacity: 0, scale: 0.95 }}
                  animate   = {{ opacity: 1, scale: 1 }}
                  className = {`p-5 rounded-2xl mb-8 border flex items-center gap-4 ${
                    status.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      :  'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  {status.type === 'success' ? <FiCheckCircle size={24} /> : <FiShield size={24} />}
                  <p className = "text-sm font-medium">{status.message}</p>
                </motion.div>
              )}

              <form onSubmit = {handlePayment} className = "space-y-8">
                <div>
                  <label   className = "block text-xs font-bold text-[var(--nm-muted)] uppercase tracking-[0.2em] mb-3 px-1">M-Pesa Phone Number</label>
                  <div     className = "relative">
                  <FiPhone className = "absolute left-5 top-1/2 -translate-y-1/2 text-[var(--nm-muted)]" size = {20} />
                    <input 
                      type = "tel"
                      required
                      value       = {phone}
                      onChange    = {(e) => setPhone(e.target.value)}
                      placeholder = "0712345678"
                      className   = "premium-input pl-14 pr-6 py-4 text-lg"
                    />
                  </div>
                  <div className = "flex justify-between items-center mt-3 px-1">
                  <p   className = "text-[10px] text-[var(--nm-soft)]">Format: 0712345678 or 254712345678</p>
                  <img src       = "https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt = "M-Pesa" className = "h-4 opacity-50" />
                  </div>
                </div>

                <button 
                  type      = "submit"
                  disabled  = {loading}
                  className = "premium-button premium-button-primary w-full disabled:opacity-50"
                >
                  {loading ? (
                    <div className = "w-6 h-6 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Pay ${total.toFixed(2)} Now</span>
                      <FiArrowRight />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className = "flex items-center justify-center gap-8 text-[var(--nm-muted)]">
            <div className = "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                <FiShield /> 100% Secure
              </div>
              <div className = "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                <FiLock /> Data Encrypted
              </div>
            </div>

            <div className = "grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <FiTruck />, title: "Priority handling", copy: "Packed and queued for dispatch after confirmation." },
                { icon: <FiClock />, title: "Fast confirmation", copy: "M-Pesa prompt usually arrives within moments." },
              ].map((item) => (
                <div className = "premium-card p-5" key = {item.title}>
                  <span className = "text-[var(--nm-gold)]">{item.icon}</span>
                  <h3 className = "mt-4 text-sm font-black uppercase tracking-widest text-white">{item.title}</h3>
                  <p className = "mt-2 text-sm leading-6 text-[var(--nm-muted)]">{item.copy}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Summary */}
          <motion.div
            initial    = {{ opacity: 0, x: 20 }}
            animate    = {{ opacity: 1, x: 0 }}
            transition = {{ delay: 0.2 }}
            className  = "lg:sticky lg:top-32 space-y-6"
          >
            <div className = "glass-panel p-8 rounded-lg">
            <h2  className = "text-2xl font-bold mb-8">Order Overview</h2>
              
              <div className = "space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                {cart.map((item, index) => (
                  <div key       = {item.id} className           = "flex gap-4">
                  <div className = "w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                  <img src       = {getImageUrl(item.image)} alt = {item.name} onError = {handleImageFallback(item, index)} className = "w-full h-full object-contain p-2" />
                    </div>
                    <div className = "flex-1">
                    <h4  className = "text-sm font-bold text-white mb-1 line-clamp-1">{item.name}</h4>
                    <p   className = "text-xs text-[var(--nm-muted)]">{item.quantity || 1} x ${Number(item.price || 0).toFixed(2)}</p>
                    </div>
                    <div className = "text-right">
                    <p   className = "text-sm font-bold text-white">${((item.quantity || 1) * Number(item.price || 0)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className = "space-y-4 pt-8 border-t border-white/5">
              <div className = "flex justify-between text-[var(--nm-muted)] text-sm">
                  <span>Subtotal</span>
                  <span className = "text-white font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className = "flex justify-between text-[var(--nm-muted)] text-sm">
                  <span>Shipping</span>
                  <span className = "text-white font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className = "flex justify-between text-[var(--nm-muted)] text-sm">
                  <span>Estimated Tax</span>
                  <span className = "text-white font-medium">${tax.toFixed(2)}</span>
                </div>
                <div  className = "pt-4 flex justify-between items-end">
                <span className = "text-[var(--nm-muted)] font-bold uppercase tracking-widest text-[10px]">Grand Total</span>
                <span className = "text-4xl font-black text-white">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className = "p-6 rounded-lg bg-white/[0.035] border border-white/10">
            <p   className = "text-xs text-[var(--nm-gold)] leading-relaxed font-medium">
                "By completing this purchase, you're supporting sustainable agriculture and ethical sourcing. Your wellness is our mission."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
