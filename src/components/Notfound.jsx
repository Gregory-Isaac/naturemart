import { Link } from "react-router-dom";

function Notfound() {
  return (
    <div className="text-center mt-5">
      <h1>404</h1>
      <p>Page Not Found</p>
      <Link to="/" className="btn btn-success">Go Home</Link>
    </div>
  );
}

export default Notfound;