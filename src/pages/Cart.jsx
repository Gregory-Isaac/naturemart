import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiGift, FiMinus, FiPlus, FiShield, FiShoppingBag, FiTrash2, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNotification } from '../components/Notification';
import { getImageUrl, handleImageFallback } from '../utils/imageUrl';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { addNotification } = useNotification();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const handleRemove = (id, name) => {
    removeFromCart(id);
    addNotification(`${name} removed from cart.`, 'info');
  };

  if (cart.length === 0) {
    return (
      <div className="premium-page min-h-[80vh] flex items-center justify-center px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="premium-card premium-veil max-w-xl p-10">
          <div className="relative z-10">
            <div className="mx-auto mb-8 grid h-24 w-24 place-items-center rounded-lg border border-white/10 bg-white/5 text-[var(--nm-gold)]">
              <FiShoppingBag size={40} />
            </div>
            <span className="premium-kicker mb-4">Your Reserve</span>
            <h2 className="premium-heading text-4xl md:text-5xl mb-5">Your cart is empty</h2>
            <p className="premium-muted mb-9">Start building a cleaner shelf with premium skincare, wellness, and lifestyle essentials.</p>
            <Link to="/shop" className="premium-button premium-button-primary">
              <FiShoppingBag />
              Start Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="premium-page pt-20 pb-32">
      <div className="premium-shell">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="premium-kicker">Reserved Items</span>
            <h1 className="premium-heading text-5xl md:text-7xl mt-4">Your <span className="text-gradient">Cart</span></h1>
            <p className="premium-muted mt-4 text-lg">You have {cart.length} items in your selection.</p>
          </div>
          <button 
            onClick={clearCart}
            className="text-[var(--nm-muted)] hover:text-red-400 text-sm font-bold uppercase tracking-widest transition-colors mb-2"
          >
            Clear Selection
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free Shipping Progress */}
            <div className="glass-panel p-6 rounded-lg mb-8">
              <div className="flex items-center gap-3 mb-4">
                <FiTruck className="text-[var(--nm-gold)]" />
                <span className="text-sm font-bold uppercase tracking-widest">
                  {subtotal >= freeShippingThreshold 
                    ? "You've earned FREE shipping!" 
                    : `Spend $${(freeShippingThreshold - subtotal).toFixed(2)} more for free shipping`}
                </span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToFreeShipping}%` }}
                  className="h-full bg-gradient-to-r from-[var(--nm-green)] to-[var(--nm-gold)]"
                />
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="glass-panel p-5 rounded-lg flex flex-col sm:flex-row items-center gap-6 group"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                    <img src={getImageUrl(item.image)} alt={item.name} onError={handleImageFallback(item, index)} className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold text-[var(--nm-gold)] uppercase tracking-widest mb-1 block">{item.category}</span>
                    <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                    <p className="text-[var(--nm-muted)] text-sm line-clamp-1">{item.description}</p>
                  </div>

                  <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                      className="w-8 h-8 flex items-center justify-center hover:text-[var(--nm-gold)] transition-colors"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity || 1}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:text-[var(--nm-gold)] transition-colors"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <p className="text-xl font-black text-white">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                  </div>

                  <button 
                    onClick={() => handleRemove(item.id, item.name)}
                    className="p-3 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 sticky top-32">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-8 rounded-lg"
            >
              <h2 className="text-2xl font-bold mb-8 text-white">Order Summary</h2>
              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <FiShield className="text-[var(--nm-gold)] mb-3" />
                  <p className="text-xs font-black uppercase tracking-widest text-white">Protected</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <FiGift className="text-[var(--nm-gold)] mb-3" />
                  <p className="text-xs font-black uppercase tracking-widest text-white">Gift ready</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-[var(--nm-green)] font-bold" : "text-white font-medium"}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Estimated Tax</span>
                  <span className="text-white font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                  <span className="text-4xl font-black text-white leading-none">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link 
                  to="/checkout" 
                  className="premium-button premium-button-primary w-full"
                >
                  <span>Checkout Now</span>
                  <FiArrowRight />
                </Link>
                <Link 
                  to="/shop" 
                  className="premium-button premium-button-ghost w-full"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-4 grayscale opacity-30">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
