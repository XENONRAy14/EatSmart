// Import du hook useState pour gérer l'état local
import { useState } from 'react';
// Import de la fonction d'initialisation des données du menu
import { runInitialization } from '../initializeData';
// Import du composant Dashboard
import Dashboard from '../components/Dashboard';
// Import de la fonction de déconnexion
import { logoutUser } from '../firebase';
// Import du hook de navigation
import { useNavigate } from 'react-router-dom';
// Import des icônes
import { LogOut, Database, BarChart2 } from 'lucide-react';
// Import de toast pour les notifications
import { toast } from 'react-hot-toast';

// Composant principal de la page d'administration
const Admin = () => {
  // État pour suivre si l'initialisation est en cours
  const [isInitializing, setIsInitializing] = useState(false);
  // État pour stocker le statut de l'initialisation (succès ou échec)
  const [initializationStatus, setInitializationStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  // État pour gérer les onglets
  const [activeTab, setActiveTab] = useState<'dashboard' | 'data'>('dashboard');
  // Hook de navigation
  const navigate = useNavigate();

  // Fonction pour gérer l'initialisation des données
  const handleInitializeData = async () => {
    try {
      // Indiquer que l'initialisation est en cours
      setIsInitializing(true);
      // Réinitialiser le statut d'initialisation
      setInitializationStatus(null);
      
      // Appeler la fonction d'initialisation importée de initializeData.ts
      await runInitialization();
      
      // Mettre à jour le statut avec un message de succès
      setInitializationStatus({
        success: true,
        message: 'Les données du menu ont été initialisées avec succès!'
      });
    } catch (error) {
      // En cas d'erreur, afficher dans la console et mettre à jour le statut
      console.error('Erreur lors de l\'initialisation des données:', error);
      setInitializationStatus({
        success: false,
        message: 'Une erreur est survenue lors de l\'initialisation des données.'
      });
    } finally {
      // Qu'il y ait une erreur ou non, indiquer que l'initialisation est terminée
      setIsInitializing(false);
    }
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      const success = await logoutUser();
      if (success) {
        toast.success('Déconnexion réussie');
        navigate('/login');
      } else {
        toast.error('Erreur lors de la déconnexion');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Une erreur est survenue lors de la déconnexion');
    }
  };

  // Rendu du composant
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Administration</h1>
        
        {/* Bouton de déconnexion */}
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Déconnexion
        </button>
      </div>
      
      {/* Onglets de navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-4 px-6 flex items-center ${
            activeTab === 'dashboard'
              ? 'border-b-2 border-emerald-500 text-emerald-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart2 className="h-5 w-5 mr-2" />
          Tableau de Bord
        </button>
        <button
          className={`py-4 px-6 flex items-center ${
            activeTab === 'data'
              ? 'border-b-2 border-emerald-500 text-emerald-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('data')}
        >
          <Database className="h-5 w-5 mr-2" />
          Gestion des Données
        </button>
      </div>
      
      {/* Contenu basé sur l'onglet actif */}
      {activeTab === 'dashboard' ? (
        <Dashboard />
      ) : (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Gestion des données</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Initialisation du menu</h3>
              <p className="text-gray-600 mb-4">
                Cliquez sur le bouton ci-dessous pour initialiser la base de données avec des éléments de menu prédéfinis.
                <br />
                <strong className="text-red-600">Attention:</strong> Cette action peut créer des doublons si exécutée plusieurs fois.
              </p>
              
              {/* Bouton d'initialisation des données */}
              <button
                onClick={handleInitializeData}
                disabled={isInitializing}
                className={`px-4 py-2 rounded-md text-white ${
                  isInitializing ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isInitializing ? (
                  <span className="flex items-center">
                    {/* Icône de chargement animée */}
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Initialisation en cours...
                  </span>
                ) : (
                  'Initialiser les données du menu'
                )}
              </button>
              
              {/* Affichage du statut d'initialisation (si disponible) */}
              {initializationStatus && (
                <div className={`mt-4 p-3 rounded-md ${
                  initializationStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {initializationStatus.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export du composant Admin
export default Admin;