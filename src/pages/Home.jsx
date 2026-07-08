import { Link }                         from "react-router-dom";
import { motion }                       from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiAward,
  FiCheckCircle,
  FiClock,
  FiHeart,
  FiPackage,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTruck,
  FiSparkles,
  FiLeaf,
} from "react-icons/fi";
import API                 from "../api/client";
import { useCart }         from "../context/CartContext";
import { useNotification } from "../components/Notification";
import { getImageUrl, handleImageFallback } from "../utils/imageUrl";
import aloeImage           from "../images/aloe_vera_gel.png";
import bambooImage         from "../images/bamboo_toothbrush.png";
import lavenderImage       from "../images/lavender_oil.png";
import "./Home.css";

const localImages = {
  aloe    : aloeImage,
  bamboo  : bambooImage,
  lavender: lavenderImage,
  bottle  : "/images/bottle.png",
  matcha  : "/images/matcha.png",
  scrub   : "/images/scrub.png",
};

const heroImage = localImages.aloe;

const localProductImages = [
  localImages.aloe,
  localImages.matcha,
  localImages.scrub,
  localImages.bottle,
  localImages.lavender,
  localImages.bamboo,
];

const fallbackProducts = [
  {
    id: 1,
    name: "Organic Aloe Vera Gel",
    category: "Skincare",
    description: "Cooling hydration with a clean, polished finish for daily skin recovery.",
    price: 15.99,
    image: localImages.aloe,
  },
  {
    id: 14,
    name: "Premium Matcha Powder",
    category: "Wellness",
    description: "Ceremonial green tea powder for smooth energy and a grounded morning ritual.",
    price: 24.99,
    image: localImages.matcha,
  },
  {
    id: 7,
    name: "Coffee Body Scrub",
    category: "Skincare",
    description: "A rich exfoliating polish made for soft skin and a brighter shower ritual.",
    price: 16.5,
    image: localImages.scrub,
  },
  {
    id: 25,
    name: "Glass Water Bottle",
    category: "Lifestyle",
    description: "A refined reusable bottle for calm desks, gym bags, and everyday hydration.",
    price: 26,
    image: localImages.bottle,
  },
  {
    id: 13,
    name: "Lavender Essential Oil",
    category: "Wellness",
    description: "Pure lavender oil for a composed evening routine and softer sleep rituals.",
    price: 12,
    image: localImages.lavender,
  },
  {
    id: 24,
    name: "Bamboo Toothbrush",
    category: "Lifestyle",
    description: "A low-waste daily essential with a clean silhouette and natural material feel.",
    price: 4.5,
    image: localImages.bamboo,
  },
];

const categoryStories = [
  {
    name : "Skincare",
    copy : "High-performance botanicals for clean, visible daily care.",
    image: localImages.aloe,
  },
  {
    name : "Wellness",
    copy : "Ritual essentials for calm energy, rest, and recovery.",
    image: localImages.matcha,
  },
  {
    name : "Lifestyle",
    copy : "Reusable everyday pieces with a quieter footprint.",
    image: localImages.bamboo,
  },
  {
    name : "Supplements",
    copy : "Clean daily support from minerals, herbs, and plant nutrition.",
    image: localImages.lavender,
  },
];

const rituals = [
  {
    title: "Morning Clarity",
    meta : "Cleanse, hydrate, protect",
    image: localImages.aloe,
  },
  {
    title: "Desk Reset",
    meta : "Focus, minerals, calm breath",
    image: localImages.matcha,
  },
  {
    title: "Evening Repair",
    meta : "Restore, soften, sleep well",
    image: localImages.lavender,
  },
];

const reserveSets = [
  {
    title: "The Glow Cabinet",
    copy : "A polished skincare edit for hydrated skin, soft texture, and a cleaner shelf.",
    image: localImages.scrub,
    meta : "Skincare set",
  },
  {
    title: "The Calm Desk",
    copy : "Wellness essentials for focused mornings, lighter afternoons, and composed evenings.",
    image: localImages.matcha,
    meta : "Wellness set",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const { addToCart }           = useCart();
  const { addNotification }     = useNotification();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/get_products");
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const homeProducts = useMemo(() => {
    const source = products.length ? products : fallbackProducts;

    return source.slice(0, 8).map((product, index) => ({
      ...product,
      image: product.image || localProductImages[index % localProductImages.length],
    }));
  }, [products]);

  const heroProducts     = useMemo(() => homeProducts.slice(0, 3), [homeProducts]);
  const featuredProducts = useMemo(() => homeProducts, [homeProducts]);
  const categoryCounts   = useMemo(
    () => 
      products.reduce((counts, product) => {
        counts[product.category] = (counts[product.category] || 0) + 1;
        return counts;
      }, {}),
    [products]
  );

  const handleAddToCart = (product) => {
    addToCart(product);
    addNotification(`${product.name} added to cart!`, "success");
  };

  // Enchanting animation variants
  const enchantVariants = {
    initial: { opacity: 0, y: 24, scale: 0.92 },
    animate: { opacity: 1, y: 0, scale: 1 },
  };

  const floatingVariants = {
    animate: {
      y: [0, -12, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(167, 139, 250, 0.3)",
        "0 0 40px rgba(167, 139, 250, 0.6)",
        "0 0 20px rgba(167, 139, 250, 0.3)",
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="home-premium min-h-screen bg-[#080807] text-white">
      {/* Animated Background Orbs */}
      <div className="home-magic-orbs">
        <div className="magic-orb orb-1" />
        <div className="magic-orb orb-2" />
        <div className="magic-orb orb-3" />
      </div>

      <section className="home-hero home-hero--enchanted">
        <img src={heroImage} alt="Premium natural skincare bottles" className="home-hero__image" />
        <div className="home-hero__shade" />

        <div className="home-shell home-hero__content">
          <motion.div
            initial={enchantVariants.initial}
            animate={enchantVariants.animate}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="home-hero__copy"
          >
            <span className="home-kicker home-kicker--enchanted">
              <FiSparkles className="kicker-icon" />
              NatureMart Enchanted
              <FiSparkles className="kicker-icon" />
            </span>
            <h1 className="home-hero-title-enchanted">
              Where nature's essence meets pure magic
            </h1>
            <p className="home-hero-description-enchanted">
              Discover our curated collection of premium natural products, each infused with the power to transform your daily rituals into moments of enchantment.
            </p>
            <div className="home-actions">
              <Link to="/shop" className="home-button home-button--primary home-button--enchanted">
                <FiShoppingBag />
                Explore the Magic
              </Link>
              <Link to="/about" className="home-button home-button--ghost home-button--enchanted-ghost">
                <FiLeaf />
                Our Enchantment
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={enchantVariants.initial}
            animate={enchantVariants.animate}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="home-hero__panel home-hero__panel--enchanted"
            variants={glowVariants}
            animate="animate"
          >
            <div>
              <span className="home-panel-label">✨ Trending Enchantments ✨</span>
              <h2>This Week's Magical Favorites</h2>
            </div>
            <div className="home-mini-products">
              {loading
                ? [0, 1, 2].map((item) => <div key={item} className="home-mini-product home-skeleton" />)
                : heroProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link to={`/product/${product.id}`} className="home-mini-product home-mini-product--enchanted">
                        <img src={getImageUrl(product.image)} alt={product.name} onError={handleImageFallback(product, index)} />
                        <div>
                          <span>{product.category}</span>
                          <strong>{product.name}</strong>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="home-proof home-proof--enchanted">
        <div className="home-shell home-proof__grid">
          {[
            { icon: <FiAward />, label: "Curated Enchanted Goods" },
            { icon: <FiShield />, label: "Magically Verified" },
            { icon: <FiTruck />, label: "Ethereal Delivery" },
            { icon: <FiPackage />, label: "Mystical Packaging" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.1 }}
              className="home-proof__item home-proof__item--enchanted"
            >
              {item.icon}
              <span>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="home-section home-section--enchanted">
        <div className="home-shell">
          <div className="home-section-heading">
            <span className="home-kicker home-kicker--section">
              <FiSparkles /> The Enchanted Collection
            </span>
            <h2>Explore magical categories & rituals</h2>
            <Link to="/shop" className="home-text-link home-text-link--enchanted">
              View all <FiArrowRight />
            </Link>
          </div>

          <div className="home-category-grid">
            {categoryStories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08, duration: 0.6 }}
                className="home-category home-category--enchanted"
                whileHover={{ y: -8 }}
              >
                <motion.img src={category.image} alt={`${category.name} collection`} variants={floatingVariants} animate="animate" />
                <div>
                  <span>{categoryCounts[category.name] || 10} products</span>
                  <h3>{category.name}</h3>
                  <p>{category.copy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--featured home-section--featured-enchanted">
        <div className="home-shell">
          <div className="home-section-heading">
            <span className="home-kicker home-kicker--featured">✨ Enchanted Selections ✨</span>
            <h2>Premium magic for everyday enchantment</h2>
          </div>

          {loading ? (
            <div className="home-product-grid">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="home-product home-skeleton" />
              ))}
            </div>
          ) : (
            <div className="home-product-grid">
              {featuredProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.06 }}
                  className="home-product home-product--enchanted"
                  whileHover={{ y: -12, boxShadow: "0 30px 60px rgba(167, 139, 250, 0.3)" }}
                >
                  <Link to={`/product/${product.id}`} className="home-product__image home-product__image--enchanted">
                    <motion.img 
                      src={getImageUrl(product.image)} 
                      alt={product.name} 
                      onError={handleImageFallback(product, index)}
                      whileHover={{ scale: 1.12, rotate: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  </Link>
                  <div className="home-product__body">
                    <span>{product.category}</span>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="home-product__footer">
                      <strong>${Number(product.price).toFixed(2)}</strong>
                      <motion.button 
                        type="button" 
                        onClick={() => handleAddToCart(product)} 
                        aria-label={`Add ${product.name} to cart`}
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiShoppingBag />
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="home-editorial home-editorial--enchanted">
        <div className="home-shell home-editorial__grid">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="home-editorial__copy"
          >
            <span className="home-kicker">Our Enchanted Standard</span>
            <h2>Pure essence, pure magic, pure you.</h2>
            <p>
              Every item is enchanted with purpose, crafted with intention, and selected for ingredient clarity, functional value, and a product experience that transforms your daily rituals into moments of pure enchantment and natural beauty.
            </p>
            <div className="home-standard-list">
              {[
                { icon: <FiCheckCircle />, text: "Ingredient-first enchantment" },
                { icon: <FiStar />, text: "Magical product visuals" },
                { icon: <FiClock />, text: "Rituals for daily enchantment" },
              ].map((item) => (
                <motion.div 
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  {item.icon}
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <div className="home-ritual-grid">
            {rituals.map((ritual, index) => (
              <motion.div 
                key={ritual.title} 
                className="home-ritual home-ritual--enchanted"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.img src={ritual.image} alt={ritual.title} variants={floatingVariants} animate="animate" />
                <div>
                  <span>{ritual.meta}</span>
                  <h3>{ritual.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-reserve home-reserve--enchanted">
        <div className="home-shell">
          <div className="home-section-heading">
            <span className="home-kicker">✨ Enchanted Sets ✨</span>
            <h2>Curated collections for magical living</h2>
          </div>

          <div className="home-reserve__grid">
            {reserveSets.map((set, index) => (
              <motion.article
                key={set.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.12 }}
                className="home-reserve-card home-reserve-card--enchanted"
                whileHover={{ y: -12 }}
              >
                <motion.div className="home-reserve-card__media" whileHover={{ scale: 1.08 }}>
                  <motion.img src={set.image} alt={set.title} variants={floatingVariants} animate="animate" />
                </motion.div>
                <div className="home-reserve-card__body">
                  <span>{set.meta}</span>
                  <h3>{set.title}</h3>
                  <p>{set.copy}</p>
                  <motion.div whileHover={{ x: 4 }} className="home-text-link home-text-link--enchanted">
                    <Link to="/shop">
                      Discover the magic <FiArrowRight />
                    </Link>
                  </motion.div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-newsletter home-newsletter--enchanted">
        <div className="home-shell home-newsletter__inner">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="home-kicker">✨ Enchanted Notes ✨</span>
            <h2>Magical drops, rituals & pure enchantment</h2>
          </motion.div>
          <motion.form
            className="home-newsletter__form home-newsletter__form--enchanted"
            onSubmit={(event) => event.preventDefault()}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <input type="email" placeholder="Enter your enchanted email..." aria-label="Email address" />
            <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Enchant Me <FiArrowRight />
            </motion.button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
