import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { FiPlus, FiHeart, FiArrowUpRight } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from './Notification';
import { getImageUrl, handleImageFallback } from '../utils/imageUrl';
import formatPrice from '../utils/formatPrice';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addNotification } = useNotification();

  const handleAddToCart = (event) => {
    event.preventDefault();
    addToCart(product);
    addNotification(`${product.name} added to cart`, 'success');
  };

  const handleToggleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(product);
    const isNowIn = !isInWishlist(product.id);
    addNotification(isNowIn ? 'Added to wishlist' : 'Removed from wishlist', isNowIn ? 'success' : 'info');
  };

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.22 }}
      className="group h-full"
    >
      <Link to={`/product/${product.id}`} className="premium-card flex h-full flex-col overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-[#11120d]">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            onError={handleImageFallback(product)}
            className="h-full w-full object-contain p-7 transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/[0.03]" />
          <div className="absolute left-4 top-4 rounded-md border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nm-gold)] backdrop-blur">
            {product.category || 'Reserve'}
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleToggleWishlist}
            className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-black/35 backdrop-blur transition-colors ${
              isInWishlist(product.id) ? 'text-red-500' : 'text-white hover:text-red-300'
            }`}
            aria-label={`${isInWishlist(product.id) ? 'Remove' : 'Add'} ${product.name} from wishlist`}
          >
            <FiHeart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-start justify-between gap-4">
            <h3 className="text-lg font-black leading-tight text-[var(--nm-ink)]">
              {product.name}
            </h3>
            <FiArrowUpRight className="mt-1 shrink-0 text-[var(--nm-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--nm-gold)]" />
          </div>

          <p className="mb-6 line-clamp-2 flex-1 text-sm leading-6 text-[var(--nm-muted)]">
            {product.description}
          </p>

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-4">
            <span className="text-2xl font-black text-[var(--nm-ink)]">
              {formatPrice(product.price)}
            </span>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleAddToCart}
              className="grid h-11 w-11 place-items-center rounded-md bg-[var(--nm-ink)] text-black shadow-lg shadow-black/20 transition-colors hover:bg-[var(--nm-green)]"
              aria-label={`Add ${product.name} to cart`}
            >
              <FiPlus size={20} />
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
