import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar bg-dark text-white p-3">
      <h4>🌿 NatureMart</h4>
      <ul className="nav flex-column mt-4">
        <li><Link className="nav-link text-white" to="/">🏠 Home</Link></li> <br />


        <li><Link className="nav-link text-white" to="/addproducts">➕ Add Product</Link></li><br />


        <li><Link className="nav-link text-white" to="/cart">🛒 Cart</Link></li> <br />


        <li><Link className="nav-link text-white" to="/orders">📦 Orders</Link></li> <br />


        <li><Link className="nav-link text-white" to="/signin">🔐 Signin</Link></li>

        
      </ul>
    </div>
  );
};

export default Sidebar;