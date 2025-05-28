// Import des hooks React
import { useState, useEffect } from 'react';
// Import du composant Dashboard (tableau de bord)
import Dashboard from '../components/Dashboard';
// Import des fonctions Firebase
import { logoutUser } from '../firebase';
// Import du hook de navigation
import { useNavigate } from 'react-router-dom';

// Composant principal de la page d'administration
// Composant principal de la page d'administration
const Admin = () => {
  // Hook pour la navigation
  const navigate = useNavigate();
  // État pour gérer les erreurs
  const [error, setError] = useState<string | null>(null);

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      // Appel à la fonction de déconnexion
      await logoutUser();
      // Redirection vers la page de connexion
      navigate('/login');
    } catch (e) {
      // En cas d'erreur, on l'affiche
      console.error("Erreur lors de la déconnexion:", e);
      setError("Erreur lors de la déconnexion");
    }

  };

  // Effet pour nettoyer les erreurs après 3 secondes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Administration</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Déconnexion
        </button>
      </div>
      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Composant Dashboard (tableau de bord) */}
      <Dashboard />
    </div>
  );
};

export default Admin;