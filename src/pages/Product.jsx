import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiAward,
  FiChevronLeft,
  FiCheckCircle,
  FiGlobe,
  FiHeart,
  FiMinus,
  FiPackage,
  FiPlus,
  FiShield,
  FiShoppingCart,
  FiStar,
  FiTruck,
  FiZap,
} from 'react-icons/fi';
import API from '../api/client';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../components/Notification';
import ProductCard from '../components/ProductCard';
import { getImageUrl, handleImageFallback } from '../utils/imageUrl';

const productNotes = [
  'Selected for ingredient clarity, shelf presence, and reliable daily performance.',
  'Packed with lower-waste materials and a careful quality check before dispatch.',
  'Built for repeat use, gifting, and rituals that feel polished without being fussy.',
];

const standards = [
  { icon: <FiShield />, label: 'Quality Guarantee', detail: 'Batch reviewed' },
  { icon: <FiGlobe />, label: 'Ethically Sourced', detail: 'Traceable supply' },
  { icon: <FiTruck />, label: 'Planet-Safe Shipping', detail: 'Low-waste pack' },
  { icon: <FiHeart />, label: 'Cruelty Free', detail: 'Never animal tested' },
];

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addNotification } = useNotification();

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get('/get_products');
        const allProducts = Array.isArray(res.data) ? res.data : [];
        setProducts(allProducts);

        const foundProduct = allProducts.find((item) => Number(item.id) === Number(id));
        if (foundProduct) {
          setProduct(foundProduct);
          window.scrollTo(0, 0);
        } else {
          navigate('/shop');
        }
      } catch (err) {
        console.error('Failed to fetch product', err);
        navigate('/shop');
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const price = Number(product?.price || 0);
  const productImage = product ? getImageUrl(product.image) : '';

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item.category === product.category && Number(item.id) !== Number(product.id))
      .slice(0, 4);
  }, [product, products]);

  const ritualPairings = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => Number(item.id) !== Number(product.id))
      .slice(0, 3);
  }, [product, products]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    addNotification(`${quantity} ${product.name} added to cart`, 'success');
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    addNotification(isInWishlist(product.id) ? 'Removed from wishlist' : 'Added to wishlist', 'info');
  };

  return (
    <div className="premium-page pt-20 pb-32">
      <div className="premium-shell">
        <Link to="/shop" className="inline-flex items-center gap-2 text-[var(--nm-muted)] hover:text-[var(--nm-gold)] transition-colors mb-10 group">
          <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Collection</span>
        </Link>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] gap-12 xl:gap-18 mb-24 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.62 }}
            className="relative"
          >
            <div className="premium-product-stage">
              <div className="premium-product-stage__rail">
                {[product, ...ritualPairings].slice(0, 4).map((item, index) => (
                  <Link
                    to={`/product/${item.id}`}
                    className={`premium-product-thumb ${Number(item.id) === Number(product.id) ? 'is-active' : ''}`}
                    key={`${item.id}-${index}`}
                    aria-label={`View ${item.name}`}
                  >
                    <img src={getImageUrl(item.image)} alt={item.name} onError={handleImageFallback(item, index)} />
                  </Link>
                ))}
              </div>

              <div className="premium-product-stage__media group">
                <img
                  src={productImage}
                  alt={product.name}
                  onError={handleImageFallback(product)}
                  className="h-full w-full object-contain p-9 md:p-14 transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute left-7 top-7 rounded-md border border-white/10 bg-black/35 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--nm-gold)] backdrop-blur">
                  Reserve Edit
                </div>
                <button
                  onClick={handleWishlist}
                  className={`absolute right-7 top-7 grid h-12 w-12 place-items-center rounded-md glass transition-all ${
                    isInWishlist(product.id) ? 'text-red-500 scale-105' : 'text-white hover:text-red-300'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <FiHeart size={22} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            <div className="absolute -inset-10 bg-[var(--nm-green)]/5 blur-[120px] -z-10 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.62, delay: 0.12 }}
            className="lg:sticky lg:top-28"
          >
            <div className="mb-8">
              <span className="premium-kicker mb-4">{product.category}</span>
              <h1 className="premium-heading text-5xl md:text-6xl xl:text-7xl mb-5">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mb-7">
                <span className="text-4xl font-black text-white">${price.toFixed(2)}</span>
                <span className="premium-status-pill">
                  <FiCheckCircle />
                  In stock
                </span>
                <span className="premium-status-pill">
                  <FiStar />
                  Reserve grade
                </span>
              </div>
              <p className="premium-muted text-lg leading-8">
                {product.description}
              </p>
            </div>

            <div className="premium-card p-5 md:p-6 mb-8">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:text-[var(--nm-gold)] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:text-[var(--nm-gold)] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <FiPlus />
                  </button>
                </div>

                <button onClick={handleAddToCart} className="premium-button premium-button-primary flex-1 min-w-[220px]">
                  <FiShoppingCart size={20} />
                  <span>Add to Cart</span>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-lg border border-white/10 bg-black/20">
                {[
                  ['Dispatch', '24h'],
                  ['Returns', '14d'],
                  ['Carbon', 'Lower'],
                ].map(([label, value]) => (
                  <div className="px-3 py-4 text-center" key={label}>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--nm-soft)]">{label}</p>
                    <p className="mt-1 text-sm font-black text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {standards.map((feature) => (
                <div key={feature.label} className="premium-spec-row">
                  <span className="text-[var(--nm-gold)]">{feature.icon}</span>
                  <div>
                    <p>{feature.label}</p>
                    <span>{feature.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr] gap-10 mb-28">
          <div>
            <span className="premium-kicker">Product Intelligence</span>
            <h2 className="premium-heading text-4xl md:text-5xl mt-4">Every detail earns its place.</h2>
          </div>

          <div>
            <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
              {['details', 'ingredients', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? 'text-white' : 'text-[var(--nm-muted)] hover:text-gray-300'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--nm-gold)]" />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {activeTab === 'details' && (
                  <div className="space-y-5 premium-muted leading-relaxed">
                    <p>
                      Our {product.name} is selected to meet a high standard of clarity, performance, and daily usefulness.
                      It is built for rituals that feel considered without becoming complicated.
                    </p>
                    <div className="grid gap-3">
                      {productNotes.map((detail, index) => (
                        <div className="premium-detail-line" key={detail}>
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <p>{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'ingredients' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-7 premium-card">
                      <FiZap className="text-[var(--nm-gold)] mb-5" size={24} />
                      <h4 className="text-white font-bold mb-3 uppercase tracking-widest text-xs">Core Ingredients</h4>
                      <p className="premium-muted leading-relaxed">Plant extracts, mineral-rich bases, clean oils, and product-specific active ingredients.</p>
                    </div>
                    <div className="p-7 premium-card">
                      <FiAward className="text-[var(--nm-gold)] mb-5" size={24} />
                      <h4 className="text-white font-bold mb-3 uppercase tracking-widest text-xs">Transparency</h4>
                      <p className="premium-muted leading-relaxed">Clear labeling, no unnecessary clutter, and a preference for materials that earn their place.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { icon: <FiPackage />, title: 'Packed carefully', text: 'Protective, lower-waste materials.' },
                      { icon: <FiTruck />, title: 'Fast delivery', text: 'Standard 3-5 days, express 1-2 days.' },
                      { icon: <FiShield />, title: 'Covered order', text: 'Free shipping on qualifying carts.' },
                    ].map((item) => (
                      <div className="premium-card p-6" key={item.title}>
                        <span className="text-[var(--nm-gold)]">{item.icon}</span>
                        <h4 className="mt-4 text-white font-bold">{item.title}</h4>
                        <p className="mt-2 premium-muted text-sm leading-6">{item.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
              <div>
                <span className="premium-kicker">Curated Pairings</span>
                <h2 className="premium-heading text-4xl md:text-5xl mt-3">Complete the Ritual</h2>
              </div>
              <Link to="/shop" className="text-[var(--nm-gold)] font-bold hover:underline">Explore More</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
