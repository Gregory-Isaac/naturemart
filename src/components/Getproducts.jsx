import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../Context/CartContext";

function Getproducts() {
  const { addToCart, addToWishlist } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // SAMPLE PRODUCTS
  const sampleProducts = [
    { id: 1, name: "Apple", price: 200, category: "fruits", image: "apple.jpg" },
    { id: 2, name: "Banana", price: 120, category: "fruits", image: "banana.jpg" },
    { id: 3, name: "Carrot", price: 150, category: "vegetables", image: "carrot.jpg" },
    { id: 4, name: "Spinach", price: 180, category: "vegetables", image: "spinach.jpg" },
    { id: 5, name: "Milk", price: 120, category: "drinks", image: "milk.jpg" },
    { id: 6, name: "Avocado", price: 250, category: "fruits", image: "avocado.jpg" },
    { id: 7, name: "Potatoes", price: 90, category: "vegetables", image: "potato.jpg" },
    { id: 8, name: "Tomatoes", price: 100, category: "vegetables", image: "tomato.jpg" }
  ];

  // FETCH DATA
  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => {
        if (res.data.length > 0) {
          setProducts(res.data);
          setFiltered(res.data);
        } else {
          setProducts(sampleProducts);
          setFiltered(sampleProducts);
        }
      })
      .catch(() => {
        setProducts(sampleProducts);
        setFiltered(sampleProducts);
      });
  }, []);

  // FILTER LOGIC
  useEffect(() => {
    let temp = products;

    if (search) {
      temp = temp.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      temp = temp.filter(p => p.category === category);
    }

    temp = temp.filter(p => p.price <= maxPrice);

    setFiltered(temp);
    setCurrentPage(1);
  }, [search, category, maxPrice, products]);

  // PAGINATION
  const indexLast = currentPage * productsPerPage;
  const indexFirst = indexLast - productsPerPage;
  const currentProducts = filtered.slice(indexFirst, indexLast);

  const totalPages = Math.ceil(filtered.length / productsPerPage);

  return (
    <div className="container mt-4">

      <h3 className="mb-4">🛍️ Products</h3>

      {/* 🔍 FILTER SECTION */}
      <div className="row mb-4">

        {/* SEARCH */}
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Search products..."
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* CATEGORY */}
        <div className="col-md-3">
          <select
            className="form-select"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="drinks">Drinks</option>
          </select>
        </div>

        {/* PRICE */}
        <div className="col-md-3">
          <input
            type="range"
            className="form-range"
            min="50"
            max="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <small>Max Price: KES {maxPrice}</small>
        </div>

      </div>

      {/* 🛒 PRODUCTS */}
      <div className="row">
        {currentProducts.map((p) => (
          <div className="col-md-4 mb-4" key={p.id}>
            <div className="card product-card shadow-sm h-100">

              <span className="badge bg-danger position-absolute m-2">SALE</span>

              <img
                src={`http://localhost:5000/static/images/${p.image}`}
                alt={p.name}
                style={{ height: "200px", objectFit: "cover" }}
              />

              <div className="card-body d-flex flex-column">
                <h6 className="fw-bold">{p.name}</h6>

                <p className="text-success fw-bold">KES {p.price}</p>

                <div className="text-warning mb-2">★★★★★</div>

                <div className="d-flex gap-2 mt-auto">
                  <button
                    className="btn btn-warning w-100"
                    onClick={() => addToCart(p)}
                  >
                    🛒
                  </button>

                  <button
                    className="btn btn-outline-danger"
                    onClick={() => addToWishlist(p)}
                  >
                    ❤️
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* 📄 PAGINATION */}
      <div className="d-flex justify-content-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`btn ${currentPage === i + 1 ? "btn-success" : "btn-outline-success"} mx-1`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
}

export default Getproducts;