export default function FeaturedCategories() {
  const categories = ["Fruits & Veggies", "Electronics", "Fashion", "Home & Kitchen"];

  return (
    <div className="py-20 px-10">
      <h2 className="text-4xl font-bold mb-10 text-white">Featured Categories</h2>
      <div className="grid md:grid-cols-4 gap-8">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="bg-cardBg backdrop-blur-md border border-cardBorder p-10 rounded-4xl text-center text-white hover:scale-105 transition shadow-glow"
          >
            <h3 className="text-2xl font-bold">{cat}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}