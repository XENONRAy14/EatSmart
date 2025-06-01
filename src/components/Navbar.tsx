import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="navbar bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost">
          <UtensilsCrossed className="h-6 w-6 text-success" />
          <span className="text-xl font-bold">EatSmart</span>
        </Link>
      </div>
      <div className="navbar-end">
        <Link to="/menu" className="btn btn-ghost">Menu</Link>
        <Link to="/order" className="btn btn-ghost">Commander</Link>
        <Link to="/kitchen" className="btn btn-ghost">Cuisine</Link>
        <Link to="/admin" className="btn btn-ghost">Admin</Link>
      </div>
    </div>
  );
};

export default Navbar;