// Import des composants nécessaires pour le routage
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Import des pages de l'application
import Home from './pages/Home';
import Menu from './pages/Menu';
import MenuItemDetail from './pages/MenuItemDetail';
import Order from './pages/Order';
import Admin from './pages/Admin';
// @ts-expect-error - Import JSX nécessaire pour la page cuisine
import Kitchen from './pages/Kitchen.jsx';
import Login from './pages/Login';
// Import du composant Navbar
import Navbar from './components/Navbar';
// Import du composant ProtectedRoute pour protéger les routes
import ProtectedRoute from './components/ProtectedRoute';
// Import du composant Toaster pour les notifications
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
/**
 * Composant principal de l'application
 * Définit les routes et la structure générale de l'application
 */
const App = () => {
  return ( 
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
    <Router>
      {/* Système de notifications toast */}
      <Toaster position="top-right" />
      
      {/* Structure principale de l'application avec flex pour garantir le footer en bas */}
      <div className="flex flex-col min-h-screen">
        {/* Barre de navigation présente sur toutes les pages */}
        <Navbar />
        
        {/* Contenu principal qui peut s'étendre */}
        <main className="flex-grow">
          {/* Définition des routes de l'application */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/:id" element={<MenuItemDetail />} />
            <Route path="/order" element={<Order />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route path="/kitchen" element={<Kitchen />} />
          </Routes>
        </main>
        
        {/* Footer présent sur toutes les pages */}
        <Footer />
      </div>
    </Router>
    </div>
  );
};

export default App;