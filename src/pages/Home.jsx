import { Link }                                            from "react-router-dom";
import { motion }                                          from "framer-motion";
import { useEffect, useMemo, useState, useCallback, memo } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiGlobe,
  FiHeart,
  FiPackage,
  FiRepeat,
  FiShield,
  FiSliders,
  FiShoppingBag,
  FiStar,
  FiSun,
  FiTruck,
  FiZap,
} from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import API from "../api/client";
import { useCart } from "../context/CartContext";
import { useNotification } from "../components/Notification";
import { getImageUrl, handleImageFallback } from "../utils/imageUrl";
import aloeImage from "../images/aloe_vera_gel.png";
import bambooImage from "../images/bamboo_toothbrush.png";
import lavenderImage from "../images/lavender_oil.png";
import "./Home.css";

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

const localImages = {
  aloe: aloeImage,
  bamboo: bambooImage,
  lavender: lavenderImage,
  bottle: "/images/bottle.png",
  matcha: "/images/matcha.png",
  scrub: "/images/scrub.png",
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
    name: "Skincare",
    copy: "High-performance botanicals for clean, visible daily care.",
    image: localImages.aloe,
  },
  {
    name: "Wellness",
    copy: "Ritual essentials for calm energy, rest, and recovery.",
    image: localImages.matcha,
  },
  {
    name: "Lifestyle",
    copy: "Reusable everyday pieces with a quieter footprint.",
    image: localImages.bamboo,
  },
  {
    name: "Supplements",
    copy: "Clean daily support from minerals, herbs, and plant nutrition.",
    image: localImages.lavender,
  },
];

const rituals = [
  {
    title: "Morning Clarity",
    meta: "Cleanse, hydrate, protect",
    image: localImages.aloe,
  },
  {
    title: "Desk Reset",
    meta: "Focus, minerals, calm breath",
    image: localImages.matcha,
  },
  {
    title: "Evening Repair",
    meta: "Restore, soften, sleep well",
    image: localImages.lavender,
  },
];

const reserveSets = [
  {
    title: "The Glow Cabinet",
    copy: "A polished skincare edit for hydrated skin, soft texture, and a cleaner shelf.",
    image: localImages.scrub,
    meta: "Skincare set",
  },
  {
    title: "The Calm Desk",
    copy: "Wellness essentials for focused mornings, lighter afternoons, and composed evenings.",
    image: localImages.matcha,
    meta: "Wellness set",
  },
];

const atelierStats = [
  ["48h", "fresh dispatch"],
  ["4.9", "customer ritual score"],
  ["100%", "quality reviewed"],
];

const pressNotes = ["Botanical", "Low-waste", "Cruelty-free", "Reserve-grade", "Daily ritual"];

const ritualBuilder = [
  {
    icon: <FiSun />,
    title: "AM Glow",
    copy: "A clean morning sequence for hydrated skin, steady focus, and a polished start.",
    items: ["Aloe veil", "Matcha lift", "Glass hydration"],
  },
  {
    icon: <FiSliders />,
    title: "Workday Reset",
    copy: "Small, useful goods that keep your desk ritual calm, refillable, and intentional.",
    items: ["Mineral sip", "Aroma cue", "Low-waste tools"],
  },
  {
    icon: <FiRepeat />,
    title: "PM Repair",
    copy: "Texture care, aromatherapy, and recovery products edited for evening consistency.",
    items: ["Coffee polish", "Lavender rest", "Skin recovery"],
  },
];

const collectionSignals = [
  ["Skin", "Hydrate, polish, restore"],
  ["Body", "Low-waste daily essentials"],
  ["Mind", "Focus, calm, sleep"],
  ["Home", "Cleaner shelves and desks"],
];

const conciergeServices = [
  {
    icon: <FiShield />,
    title: "Reserve Quality Review",
    copy: "Each product is checked for ingredient clarity, presentation, and daily-use value before it earns a place.",
  },
  {
    icon: <FiPackage />,
    title: "Gift-Caliber Packing",
    copy: "Orders are prepared with a cleaner unboxing experience, protective materials, and a low-waste mindset.",
  },
  {
    icon: <FiGlobe />,
    title: "Conscious Sourcing",
    copy: "Botanical, wellness, and lifestyle essentials are selected with traceable materials wherever possible.",
  },
];

const provenanceSteps = [
  ["01", "Source", "We look for functional botanicals, durable materials, and formulas with a clear purpose."],
  ["02", "Edit", "Only the products that feel useful, beautiful, and repeatable make the customer-facing collection."],
  ["03", "Prepare", "Every order is packed for protection, presentation, and a calmer delivery experience."],
];

const testimonials = [
  {
    quote: "The products feel curated, not random. Everything I ordered looked beautiful on arrival and fit straight into my routine.",
    name: "Amina K.",
    role: "Skincare customer",
  },
  {
    quote: "NatureMart feels calmer than normal online shopping. Clear products, good packaging, and no clutter.",
    name: "Brian M.",
    role: "Wellness customer",
  },
  {
    quote: "I bought a small wellness set as a gift and it genuinely felt premium without being wasteful.",
    name: "Leah W.",
    role: "Gift buyer",
  },
];

const proofItems = [
  { icon: <FiZap />, label: "Curated premium goods" },
  { icon: <FiShield />, label: "Quality checked" },
  { icon: <FiTruck />, label: "Reliable delivery" },
  { icon: <FiPackage />, label: "Low-waste packaging" },
];

const standardItems = [
  { icon: <FiCheckCircle />, text: "Ingredient-first selection" },
  { icon: <FiStar />, text: "Premium product photography" },
  { icon: <FiCheckCircle />, text: "Rituals built for daily use" },
];

// ============================================================================
// MEMOIZED COMPONENTS
// ============================================================================

/**
 * HeroStats Component - Memoized to prevent unnecessary re-renders
 */
const HeroStats = memo(({ stats }) => (
  <div className="home-hero__stats">
    {stats.map(([value, label]) => (
      <div key={label}>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    ))}
  </div>
));
HeroStats.displayName = "HeroStats";

/**
 * SignalRow Component - Memoized
 */
const SignalRow = memo(({ signals }) => (
  <div className="home-hero__signal-row" aria-label="Collection signals">
    {signals.map(([label, copy]) => (
      <span key={label}>
        <strong>{label}</strong>
        {copy}
      </span>
    ))}
  </div>
));
SignalRow.displayName = "SignalRow";

/**
 * ProductImage Component - Handles image loading with memoization
 */
const ProductImage = memo(({ src, alt, onError }) => (
  <img
    src={src}
    alt={alt}
    onError={onError}
    loading="lazy"
    decoding="async"
  />
));
ProductImage.displayName = "ProductImage";

/**
 * MiniProduct Card - Memoized single product in hero showcase
 */
const MiniProductCard = memo(({ product, index }) => (
  <Link to={`/product/${product.id}`} className="home-mini-product">
    <ProductImage
      src={getImageUrl(product.image)}
      alt={product.name}
      onError={handleImageFallback(product, index)}
    />
    <div>
      <span>{product.category}</span>
      <strong>{product.name}</strong>
    </div>
  </Link>
));
MiniProductCard.displayName = "MiniProductCard";

/**
 * MiniProductSkeleton - Loading placeholder
 */
const MiniProductSkeleton = memo(() => (
  <div className="home-mini-product home-skeleton" />
));
MiniProductSkeleton.displayName = "MiniProductSkeleton";

/**
 * HeroShowcase - Memoized hero section showcase grid
 */
const HeroShowcase = memo(({ products, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.15 }}
    className="home-hero__showcase"
  >
    <div className="home-hero__orbital">
      <img
        src={localImages.matcha}
        alt="Premium matcha wellness product"
        loading="lazy"
      />
      <img
        src={localImages.lavender}
        alt="Lavender essential oil"
        loading="lazy"
      />
    </div>
    <div className="home-hero__drop">
      <span>Drop 05</span>
      <strong>Botanical Reserve</strong>
      <small>Limited ritual edit</small>
    </div>
    <div className="home-hero__panel">
      <div>
        <span className="home-panel-label">Private Curation</span>
        <h2>Clean essentials trending now</h2>
      </div>
      <div className="home-mini-products">
        {isLoading
          ? [0, 1, 2].map((item) => <MiniProductSkeleton key={item} />)
          : products.map((product, index) => (
              <MiniProductCard key={product.id} product={product} index={index} />
            ))}
      </div>
    </div>
  </motion.div>
));
HeroShowcase.displayName = "HeroShowcase";

/**
 * CategoryCard - Memoized category display
 */
const CategoryCard = memo(({ category, productCount, index }) => (
  <motion.div
    key={category.name}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ delay: index * 0.06 }}
    className="home-category"
  >
    <img
      src={category.image}
      alt={`${category.name} collection`}
      loading="lazy"
    />
    <div>
      <span>{productCount} products</span>
      <h3>{category.name}</h3>
      <p>{category.copy}</p>
    </div>
  </motion.div>
));
CategoryCard.displayName = "CategoryCard";

/**
 * ProductCard - Featured product in grid
 */
const ProductCard = memo(({ product, index, onAddToCart }) => (
  <motion.article
    key={product.id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ delay: index * 0.04 }}
    className="home-product"
  >
    <Link to={`/product/${product.id}`} className="home-product__image">
      <ProductImage
        src={getImageUrl(product.image)}
        alt={product.name}
        onError={handleImageFallback(product, index)}
      />
    </Link>
    <div className="home-product__body">
      <span>{product.category}</span>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="home-product__footer">
        <strong>${Number(product.price).toFixed(2)}</strong>
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          aria-label={`Add ${product.name} to cart`}
        >
          <FiShoppingBag />
        </button>
      </div>
    </div>
  </motion.article>
));
ProductCard.displayName = "ProductCard";

/**
 * ProductGrid - Memoized grid of featured products
 */
const ProductGrid = memo(({ products, isLoading, onAddToCart }) => {
  if (isLoading) {
    return (
      <div className="home-product-grid">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="home-product home-skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="home-product-grid">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
});
ProductGrid.displayName = "ProductGrid";

/**
 * ProofGrid - Memoized proof/benefits section
 */
const ProofGrid = memo(({ items }) => (
  <div className="home-shell home-proof__grid">
    {items.map((item) => (
      <div className="home-proof__item" key={item.label}>
        {item.icon}
        <span>{item.label}</span>
      </div>
    ))}
  </div>
));
ProofGrid.displayName = "ProofGrid";

/**
 * ConciergeCard - Service card in concierge section
 */
const ConciergeCard = memo(({ service, index }) => (
  <motion.article
    key={service.title}
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    className="home-concierge-card"
  >
    <span>{service.icon}</span>
    <h3>{service.title}</h3>
    <p>{service.copy}</p>
  </motion.article>
));
ConciergeCard.displayName = "ConciergeCard";

/**
 * RitualBuilderCard - Ritual builder section card
 */
const RitualBuilderCard = memo(({ ritual, index }) => (
  <motion.article
    key={ritual.title}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ delay: index * 0.06 }}
    className="home-builder-card"
  >
    <div className="home-builder-card__top">
      <span>{ritual.icon}</span>
      <small>0{index + 1}</small>
    </div>
    <h3>{ritual.title}</h3>
    <p>{ritual.copy}</p>
    <div className="home-builder-card__items">
      {ritual.items.map((item) => (
        <em key={item}>{item}</em>
      ))}
    </div>
  </motion.article>
));
RitualBuilderCard.displayName = "RitualBuilderCard";

/**
 * ReserveCard - Reserve set card
 */
const ReserveCard = memo(({ set, index }) => (
  <motion.article
    key={set.title}
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ delay: index * 0.08 }}
    className="home-reserve-card"
  >
    <div className="home-reserve-card__media">
      <img src={set.image} alt={set.title} loading="lazy" />
    </div>
    <div className="home-reserve-card__body">
      <span>{set.meta}</span>
      <h3>{set.title}</h3>
      <p>{set.copy}</p>
      <Link to="/shop" className="home-text-link">
        Build the set <FiArrowRight />
      </Link>
    </div>
  </motion.article>
));
ReserveCard.displayName = "ReserveCard";

/**
 * Testimonial - Single customer testimonial
 */
const Testimonial = memo(({ item }) => (
  <article className="home-testimonial" key={item.name}>
    <div className="home-testimonial__stars">
      {[0, 1, 2, 3, 4].map((star) => (
        <FiStar key={star} />
      ))}
    </div>
    <p>"{item.quote}"</p>
    <div>
      <strong>{item.name}</strong>
      <span>{item.role}</span>
    </div>
  </article>
));
Testimonial.displayName = "Testimonial";

/**
 * NewsletterForm - Email subscription form
 */
const NewsletterForm = memo(({ onSubmit }) => (
  <form className="home-newsletter__form" onSubmit={onSubmit}>
    <label htmlFor="newsletter-email" className="sr-only">
      Email address
    </label>
    <input
      id="newsletter-email"
      name="email"
      type="email"
      placeholder="Email address"
      aria-label="Email address"
      required
    />
    <button type="submit">
      Subscribe <FiArrowRight />
    </button>
  </form>
));
NewsletterForm.displayName = "NewsletterForm";

// ============================================================================
// MAIN HOME COMPONENT
// ============================================================================

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addNotification } = useNotification();

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/get_products");
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch featured products", err);
        // Products default to fallbackProducts via useMemo
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Memoized product arrays - only recalculate when products changes
  const homeProducts = useMemo(() => {
    const source = products.length ? products : fallbackProducts;
    return source.slice(0, 8).map((product, index) => ({
      ...product,
      image: product.image || localProductImages[index % localProductImages.length],
    }));
  }, [products]);

  const heroProducts = useMemo(() => homeProducts.slice(0, 3), [homeProducts]);
  const featuredProducts = useMemo(() => homeProducts, [homeProducts]);

  // Build category count map from products
  const categoryCounts = useMemo(() => {
    if (!products.length) {
      return categoryStories.reduce((acc, cat) => {
        acc[cat.name] = 10; // Default to 10 if no real products
        return acc;
      }, {});
    }
    return products.reduce((counts, product) => {
      counts[product.category] = (counts[product.category] || 0) + 1;
      return counts;
    }, {});
  }, [products]);

  // Memoized cart add handler - stable reference
  const handleAddToCart = useCallback((product) => {
    addToCart(product);
    addNotification(`${product.name} added to cart!`, "success");
  }, [addToCart, addNotification]);

  // Memoized newsletter submit handler
  const handleNewsletterSubmit = useCallback((event) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    if (email) {
      // TODO: Implement actual newsletter submission
      addNotification("Thanks for subscribing!", "success");
      event.currentTarget.reset();
    }
  }, [addNotification]);

  return (
    <div className="home-premium min-h-screen bg-[#080807] text-white">
      {/* HERO SECTION */}
      <section className="home-hero">
        <img
          src={heroImage}
          alt="Premium natural skincare bottles"
          className="home-hero__image"
          loading="eager"
          decoding="async"
        />
        <div className="home-hero__shade" />
        <div className="home-hero__grain" />

        <div className="home-shell home-hero__content">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="home-hero__copy"
          >
            <span className="home-kicker home-kicker--halo">
              NatureMart Reserve Atelier
            </span>
            <h1>Ultra-premium natural care for a calmer shelf.</h1>
            <p>
              A high-touch edit of skincare, wellness, supplements, and low-waste essentials chosen for ingredient clarity,
              beautiful rituals, and quiet everyday performance.
            </p>
            <div className="home-actions">
              <Link to="/shop" className="home-button home-button--primary">
                <FiShoppingBag />
                Shop Collection
              </Link>
              <Link to="/about" className="home-button home-button--ghost">
                <FiHeart />
                Our Standard
              </Link>
            </div>

            <HeroStats stats={atelierStats} />
            <SignalRow signals={collectionSignals} />
          </motion.div>

          <HeroShowcase products={heroProducts} isLoading={loading} />
        </div>
      </section>

      {/* MARQUEE SECTION */}
      <section className="home-marquee" aria-label="NatureMart standards">
        <div>
          {[...pressNotes, ...pressNotes].map((note, index) => (
            <span key={`${note}-${index}`}>{note}</span>
          ))}
        </div>
      </section>

      {/* PROOF SECTION */}
      <section className="home-proof">
        <ProofGrid items={proofItems} />
      </section>

      {/* CONCIERGE SECTION */}
      <section className="home-concierge">
        <div className="home-shell home-concierge__grid">
          <div className="home-concierge__intro">
            <span className="home-kicker">Reserve Concierge</span>
            <h2>Luxury is the feeling that every detail has already been handled.</h2>
          </div>
          {conciergeServices.map((service, index) => (
            <ConciergeCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </section>

      {/* RITUAL BUILDER SECTION */}
      <section className="home-ritual-builder">
        <div className="home-shell">
          <div className="home-section-heading">
            <span className="home-kicker">Ritual Builder</span>
            <h2>Choose the rhythm. We curate the shelf.</h2>
            <Link to="/shop" className="home-text-link">
              Start building <FiArrowRight />
            </Link>
          </div>

          <div className="home-builder-grid">
            {ritualBuilder.map((ritual, index) => (
              <RitualBuilderCard key={ritual.title} ritual={ritual} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTION SECTION */}
      <section className="home-section">
        <div className="home-shell">
          <div className="home-section-heading">
            <span className="home-kicker">The Collection</span>
            <h2>Shop by ritual, need, or material.</h2>
            <Link to="/shop" className="home-text-link">
              View all <FiArrowRight />
            </Link>
          </div>

          <div className="home-category-grid">
            {categoryStories.map((category, index) => (
              <CategoryCard
                key={category.name}
                category={category}
                productCount={categoryCounts[category.name] || 10}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="home-section home-section--featured">
        <div className="home-shell">
          <div className="home-section-heading">
            <span className="home-kicker">Editor Picks</span>
            <h2>Quiet luxury for everyday care.</h2>
          </div>

          <ProductGrid
            products={featuredProducts}
            isLoading={loading}
            onAddToCart={handleAddToCart}
          />
        </div>
      </section>

      {/* SIGNATURE SECTION */}
      <section className="home-signature">
        <div className="home-shell home-signature__grid">
          <div className="home-signature__media">
            <img
              src={localImages.aloe}
              alt="Signature NatureMart skincare selection"
              loading="lazy"
            />
            <div>
              <span>Signature Drop</span>
              <strong>Hydration Reserve</strong>
            </div>
          </div>
          <div className="home-signature__copy">
            <span className="home-kicker">Featured Ritual</span>
            <h2>The products should look calm before they even touch your skin.</h2>
            <p>
              NatureMart Reserve is built around a simple idea: clean products should feel refined, practical, and
              beautiful enough to stay visible in your daily space.
            </p>
            <Link to="/shop" className="home-button home-button--primary">
              Shop the Edit <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* EDITORIAL SECTION */}
      <section className="home-editorial">
        <div className="home-shell home-editorial__grid">
          <div className="home-editorial__copy">
            <span className="home-kicker">Our Standard</span>
            <h2>Botanical performance without the visual noise.</h2>
            <p>
              Every item is chosen for ingredient clarity, functional value, and a product experience that feels calm,
              useful, and beautiful on the shelf.
            </p>
            <div className="home-standard-list">
              {standardItems.map((item) => (
                <div key={item.text}>
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="home-ritual-grid">
            {rituals.map((ritual) => (
              <div className="home-ritual" key={ritual.title}>
                <img src={ritual.image} alt={ritual.title} loading="lazy" />
                <div>
                  <span>{ritual.meta}</span>
                  <h3>{ritual.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROVENANCE SECTION */}
      <section className="home-provenance">
        <div className="home-shell">
          <div className="home-section-heading">
            <span className="home-kicker">From Source to Shelf</span>
            <h2>A sharper standard behind every order.</h2>
          </div>
          <div className="home-provenance__grid">
            {provenanceSteps.map(([number, title, copy]) => (
              <div className="home-provenance-step" key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESERVE SETS SECTION */}
      <section className="home-section home-reserve">
        <div className="home-shell">
          <div className="home-section-heading">
            <span className="home-kicker">Reserve Sets</span>
            <h2>Curated edits for a better daily rhythm.</h2>
          </div>

          <div className="home-reserve__grid">
            {reserveSets.map((set, index) => (
              <ReserveCard key={set.title} set={set} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="home-testimonials">
        <div className="home-shell">
          <div className="home-section-heading">
            <span className="home-kicker">Customer Notes</span>
            <h2>Quiet proof from everyday rituals.</h2>
          </div>

          <div className="home-testimonials__grid">
            {testimonials.map((item) => (
              <Testimonial key={item.name} item={item} />
            ))}
          </div>

          <div className="home-membership">
            <div>
              <span className="home-kicker">Reserve Access</span>
              <h3>Build a cleaner shelf with first access to new drops.</h3>
            </div>
            <Link to="/shop" className="home-button home-button--primary">
              Enter the Collection <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ULTRA PREMIUM MEMBERSHIP CTA */}
      <section className="home-section" style={{ padding: "72px 0", background: "linear-gradient(180deg, #080807 0%, rgba(216,180,95,0.06) 50%, #080807 100%)" }}>
        <div className="home-shell">
          <div className="home-membership" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "28px", border: "1px solid rgba(216,180,95,0.26)", borderRadius: "8px", background: "radial-gradient(circle at 86% 50%, rgba(53,208,127,0.12), transparent 20rem), linear-gradient(135deg, rgba(216,180,95,0.13), rgba(255,255,255,0.035)), rgba(8,8,7,0.88)", padding: "clamp(24px, 4vw, 36px)" }}>
            <div>
              <span className="home-kicker">Ultra Premium</span>
              <h3 style={{ maxWidth: "760px", marginTop: "10px", color: "var(--home-ink)", fontSize: "clamp(1.8rem, 4vw, 3.5rem)", fontWeight: 950, lineHeight: 1 }}>
                The finest care, reserved for you.
              </h3>
              <p style={{ marginTop: "14px", color: "var(--home-muted)", fontSize: "0.95rem", lineHeight: 1.65, maxWidth: "560px" }}>
                Private membership with exclusive drops, unlimited free shipping, and a quarterly edit box.
              </p>
            </div>
            <Link to="/ultra-premium" className="home-button home-button--primary">
              <FaCrown size={20} />
              Explore Tiers <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="home-newsletter">
        <div className="home-shell home-newsletter__inner">
          <div>
            <span className="home-kicker">Private Notes</span>
            <h2>New drops, calm routines, better shelves.</h2>
          </div>
          <NewsletterForm onSubmit={handleNewsletterSubmit} />
        </div>
      </section>
    </div>
  );
}
