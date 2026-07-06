import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiFilter, FiGrid, FiSearch, FiSliders } from 'react-icons/fi';
import API from '../api/client';
import ProductCard from '../components/ProductCard';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortMode, setSortMode] = useState("featured");

  const categories = ["All", "Skincare", "Lifestyle", "Supplements", "Wellness", "Organic"];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/get_products');
      setProducts(Array.isArray(res.data) ? res.data : []);
      setError("");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products", error);
      setError("We couldn't load the collection right now. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const name = String(p.name || '').toLowerCase();
    const description = String(p.description || '').toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || description.includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortMode === 'price-low') return Number(a.price || 0) - Number(b.price || 0);
    if (sortMode === 'price-high') return Number(b.price || 0) - Number(a.price || 0);
    if (sortMode === 'name') return String(a.name || '').localeCompare(String(b.name || ''));
    return 0;
  });

  const categoryCount = selectedCategory === 'All'
    ? products.length
    : products.filter((product) => product.category === selectedCategory).length;

  return (
    <div className="premium-page pt-16 pb-24 relative overflow-hidden">
      <div className="premium-shell relative z-10">
        {/* Header Section */}
        <div className="premium-card premium-veil p-6 md:p-10 mb-10">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="premium-kicker"
            >
              NatureMart Reserve
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="premium-heading text-5xl md:text-7xl mt-4 mb-4"
            >
              The <span className="text-gradient">Collection</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="premium-muted text-lg leading-8"
            >
              Discover our hand-picked selection of premium natural products, designed to elevate your everyday life.
            </motion.p>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
              {[
                ['Products', products.length || '--'],
                ['Categories', categories.length - 1],
                ['Standard', 'Reserve'],
              ].map(([label, value]) => (
                <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-3" key={label}>
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nm-soft)]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-[420px] space-y-3"
          >
            <div className="relative">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--nm-muted)]" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="premium-input py-4 pl-14 pr-6 placeholder:text-[var(--nm-soft)]"
              />
            </div>
            <div className="relative">
              <FiSliders className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--nm-muted)]" size={18} />
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value)}
                className="premium-input py-4 pl-14 pr-6 appearance-none"
                aria-label="Sort products"
              >
                <option value="featured">Featured curation</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </motion.div>
          </div>
        </div>

        {/* Categories Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center gap-3 mb-12"
        >
          <div className="flex items-center gap-2 text-[var(--nm-muted)] mr-2">
            <FiFilter size={18} />
            <span className="text-sm font-medium uppercase tracking-wider">Filter:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-md text-xs font-black uppercase tracking-[0.12em] transition-all duration-300 border ${
                selectedCategory === cat 
                ? 'bg-[var(--nm-ink)] text-black border-transparent shadow-lg shadow-black/20' 
                : 'bg-white/5 text-[var(--nm-muted)] border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4">
          <div className="flex items-center gap-3 text-[var(--nm-muted)]">
            <FiGrid className="text-[var(--nm-gold)]" />
            <span className="text-sm">
              Showing <strong className="text-white">{filteredProducts.length}</strong> of <strong className="text-white">{categoryCount}</strong> curated items
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nm-muted)]">
            <FiAward className="text-[var(--nm-gold)]" />
            Quality reviewed before dispatch
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-white/10 border-t-[var(--nm-gold)] rounded-full animate-spin"></div>
            <p className="premium-muted font-bold tracking-widest text-sm uppercase">Curating products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-32 premium-card">
            <p className="text-[var(--nm-muted)] text-xl mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="text-[var(--nm-gold)] hover:text-white underline transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div 
                  key="grid"
                  variants={container} 
                  initial="hidden" 
                  animate="show" 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {filteredProducts.map(p => (
                    <motion.div variants={item} key={p._id || p.id}>
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-32 premium-card"
                >
                  <p className="text-[var(--nm-muted)] text-xl mb-2">No products found matching your search.</p>
                  <button 
                    onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}
                    className="text-[var(--nm-gold)] hover:text-white underline transition-colors"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
