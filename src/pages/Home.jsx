import { Link }                from "react-router-dom";
import { motion }              from "framer-motion";
import { useMemo }             from "react";
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
} from "react-icons/fi";
import { useCart }         from "../context/CartContext";
import { useNotification } from "../components/Notification";
import useProducts         from "../hooks/useProducts";
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
  const { products, loading }   = useProducts();
  const { addToCart }           = useCart();
  const { addNotification }     = useNotification();

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

  return (
    <div     className = "home-premium min-h-screen bg-[#080807] text-white">
    <section className = "home-hero">
    <img     src       = {heroImage} alt = "Premium natural skincare bottles" className = "home-hero__image" />
    <div     className = "home-hero__shade" />

        <div className = "home-shell home-hero__content">
          <motion.div
            initial    = {{ opacity: 0, y: 24 }}
            animate    = {{ opacity: 1, y: 0 }}
            transition = {{ duration: 0.7 }}
            className  = "home-hero__copy"
          >
            <span className = "home-kicker">NatureMart Reserve</span>
            <h1>Natural goods, selected with exacting care.</h1>
            <p>
              Premium skincare, wellness, supplements, and low-waste essentials curated for a cleaner daily ritual.
            </p>
            <div  className = "home-actions">
            <Link to        = "/shop" className = "home-button home-button--primary">
                <FiShoppingBag />
                Shop Collection
              </Link>
              <Link to = "/about" className = "home-button home-button--ghost">
                <FiHeart />
                Our Standard
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial    = {{ opacity: 0, y: 28 }}
            animate    = {{ opacity: 1, y: 0 }}
            transition = {{ duration: 0.7, delay: 0.15 }}
            className  = "home-hero__panel"
          >
            <div>
              <span className = "home-panel-label">This Week</span>
              <h2>Clean essentials trending now</h2>
            </div>
            <div className = "home-mini-products">
              {loading
                ? [0, 1, 2].map((item) => <div key={item} className="home-mini-product home-skeleton" />)
                : heroProducts.map((product, index) => (
                    <Link to  = {`/product/${product.id}`} className = "home-mini-product" key = {product.id}>
                    <img  src = {getImageUrl(product.image)} alt     = {product.name} onError = {handleImageFallback(product, index)} />
                      <div>
                        <span>{product.category}</span>
                        <strong>{product.name}</strong>
                      </div>
                    </Link>
                  ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className = "home-proof">
      <div     className = "home-shell home-proof__grid">
          {[
            { icon: <FiAward />, label: "Curated premium goods" },
            { icon: <FiShield />, label: "Quality checked" },
            { icon: <FiTruck />, label: "Reliable delivery" },
            { icon: <FiPackage />, label: "Low-waste packaging" },
          ].map((item) => (
            <div className = "home-proof__item" key = {item.label}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className = "home-section">
      <div     className = "home-shell">
      <div     className = "home-section-heading">
      <span    className = "home-kicker">The Collection</span>
            <h2>Shop by ritual, need, or material.</h2>
            <Link to = "/shop" className = "home-text-link">
              View all <FiArrowRight />
            </Link>
          </div>

          <div className = "home-category-grid">
            {categoryStories.map((category, index) => (
              <motion.div
                key         = {category.name}
                initial     = {{ opacity: 0, y: 20 }}
                whileInView = {{ opacity: 1, y: 0 }}
                viewport    = {{ once: true, margin: "-80px" }}
                transition  = {{ delay: index * 0.06 }}
                className   = "home-category"
              >
                <img src = {category.image} alt = {`${category.name} collection`} />
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

      <section className = "home-section home-section--featured">
      <div     className = "home-shell">
      <div     className = "home-section-heading">
      <span    className = "home-kicker">Editor Picks</span>
            <h2>Quiet luxury for everyday care.</h2>
          </div>

          {loading ? (
            <div className = "home-product-grid">
              {[0, 1, 2, 3].map((item) => (
                <div key = {item} className = "home-product home-skeleton" />
              ))}
            </div>
          ) : (
            <div className = "home-product-grid">
              {featuredProducts.map((product, index) => (
                <motion.article
                  key         = {product.id}
                  initial     = {{ opacity: 0, y: 20 }}
                  whileInView = {{ opacity: 1, y: 0 }}
                  viewport    = {{ once: true, margin: "-80px" }}
                  transition  = {{ delay: index * 0.04 }}
                  className   = "home-product"
                >
                  <Link to  = {`/product/${product.id}`} className = "home-product__image">
                  <img  src = {getImageUrl(product.image)} alt     = {product.name} onError = {handleImageFallback(product, index)} />
                  </Link>
                  <div className = "home-product__body">
                    <span>{product.category}</span>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className = "home-product__footer">
                      <strong>${Number(product.price).toFixed(2)}</strong>
                      <button type = "button" onClick = {() => handleAddToCart(product)} aria-label = {`Add ${product.name} to cart`}>
                        <FiShoppingBag />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className = "home-editorial">
      <div     className = "home-shell home-editorial__grid">
      <div     className = "home-editorial__copy">
      <span    className = "home-kicker">Our Standard</span>
            <h2>Botanical performance without the visual noise.</h2>
            <p>
              Every item is chosen for ingredient clarity, functional value, and a product experience that feels calm,
              useful, and beautiful on the shelf.
            </p>
            <div className = "home-standard-list">
              {[
                { icon: <FiCheckCircle />, text: "Ingredient-first selection" },
                { icon: <FiStar />, text: "Premium product photography" },
                { icon: <FiClock />, text: "Rituals built for daily use" },
              ].map((item) => (
                <div key = {item.text}>
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className = "home-ritual-grid">
            {rituals.map((ritual) => (
              <div className = "home-ritual" key  = {ritual.title}>
              <img src       = {ritual.image} alt = {ritual.title} />
                <div>
                  <span>{ritual.meta}</span>
                  <h3>{ritual.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className = "home-section home-reserve">
      <div     className = "home-shell">
      <div     className = "home-section-heading">
      <span    className = "home-kicker">Reserve Sets</span>
            <h2>Curated edits for a better daily rhythm.</h2>
          </div>

          <div className = "home-reserve__grid">
            {reserveSets.map((set, index) => (
              <motion.article
                key         = {set.title}
                initial     = {{ opacity: 0, y: 22 }}
                whileInView = {{ opacity: 1, y: 0 }}
                viewport    = {{ once: true, margin: "-80px" }}
                transition  = {{ delay: index * 0.08 }}
                className   = "home-reserve-card"
              >
                <div className = "home-reserve-card__media">
                  <img src = {set.image} alt = {set.title} />
                </div>
                <div className = "home-reserve-card__body">
                  <span>{set.meta}</span>
                  <h3>{set.title}</h3>
                  <p>{set.copy}</p>
                  <Link to = "/shop" className = "home-text-link">
                    Build the set <FiArrowRight />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className = "home-newsletter">
      <div     className = "home-shell home-newsletter__inner">
          <div>
            <span className = "home-kicker">Private Notes</span>
            <h2>New drops, calm routines, better shelves.</h2>
          </div>
          <form   className = "home-newsletter__form" onSubmit = {(event) => event.preventDefault()}>
          <input  type      = "email" placeholder = "Email address" aria-label = "Email address" />
          <button type      = "submit">
              Subscribe <FiArrowRight />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
