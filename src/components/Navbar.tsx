import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <UtensilsCrossed className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">EatSmart</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/menu" className="text-gray-700 hover:text-emerald-600">Menu</Link>
            <Link to="/order" className="text-gray-700 hover:text-emerald-600">Commander</Link>
            <Link to="/kitchen" className="text-gray-700 hover:text-emerald-600">Cuisine</Link>
            <Link to="/admin" className="text-gray-700 hover:text-emerald-600">Admin</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;