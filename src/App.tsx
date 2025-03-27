// Import des composants nécessaires pour le routage
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Import des pages de l'application
import Home from './pages/Home';
import Menu from './pages/Menu';
import Order from './pages/Order';
import Admin from './pages/Admin';
import Kitchen from './pages/Kitchen';
// Import du composant Navbar
import Navbar from './components/Navbar';
// Import du composant Toaster pour les notifications
import { Toaster } from 'react-hot-toast';

/**
 * Composant principal de l'application
 * Définit les routes et la structure générale de l'application
 */
const App = () => {
  return (
    <Router>
      {/* Système de notifications toast */}
      <Toaster position="top-right" />
      
      {/* Barre de navigation présente sur toutes les pages */}
      <Navbar />
      
      {/* Définition des routes de l'application */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<Order />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/kitchen" element={<Kitchen />} />
      </Routes>
    </Router>
  );
};

export default App;