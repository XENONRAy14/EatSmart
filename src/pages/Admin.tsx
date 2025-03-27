// Import du hook useState pour gérer l'état local
import { useState } from 'react';
// Import de la fonction d'initialisation des données du menu
import { runInitialization } from '../initializeData';

// Composant principal de la page d'administration
const Admin = () => {
  // État pour suivre si l'initialisation est en cours
  const [isInitializing, setIsInitializing] = useState(false);
  // État pour stocker le statut de l'initialisation (succès ou échec)
  const [initializationStatus, setInitializationStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

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

  // Rendu du composant
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Administration</h1>
      
      {/* Section de gestion des données */}
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
      
      {/* Section pour les futures fonctionnalités d'administration */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Autres fonctionnalités d'administration</h2>
        <p className="text-gray-600">
          D'autres fonctionnalités d'administration seront ajoutées prochainement.
        </p>
      </div>
    </div>
  );
};

// Export du composant Admin
export default Admin;