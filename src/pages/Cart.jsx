import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiGift, FiShield, FiShoppingBag, FiTrash2, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNotification } from '../components/Notification';
import { getImageUrl, handleImageFallback } from '../utils/imageUrl';
import { calculateOrderTotals, FREE_SHIPPING_THRESHOLD } from '../utils/cartCalculations';
import formatPrice from '../utils/formatPrice';
import EmptyState from '../components/EmptyState';
import QuantitySelector from '../components/QuantitySelector';
import OrderSummaryLines from '../components/OrderSummaryLines';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { addNotification } = useNotification();

  const { subtotal, shipping, tax, total } = calculateOrderTotals(cart);
  const progressToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const handleRemove = (id, name) => {
    removeFromCart(id);
    addNotification(`${name} removed from cart.`, 'info');
  };

  if (cart.length === 0) {
    return (
      <EmptyState
        icon={FiShoppingBag}
        kicker="Your Reserve"
        heading="Your cart is empty"
        description="Start building a cleaner shelf with premium skincare, wellness, and lifestyle essentials."
        linkTo="/shop"
        linkLabel="Start Shopping"
        linkIcon={FiShoppingBag}
      />
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
                  {subtotal >= FREE_SHIPPING_THRESHOLD 
                    ? "You've earned FREE shipping!" 
                    : `Spend ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping`}
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

                  <QuantitySelector
                    value={item.quantity || 1}
                    onChange={(qty) => updateQuantity(item.id, qty)}
                  />

                  <div className="text-right min-w-[80px]">
                    <p className="text-xl font-black text-white">{formatPrice(item.price * (item.quantity || 1))}</p>
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
              
              <div className="mb-8">
                <OrderSummaryLines subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
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
