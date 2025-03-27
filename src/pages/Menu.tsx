// Import des hooks nécessaires
import { useState, useEffect } from 'react';
// Import des fonctions Firebase
import { getMenuItems } from '../firebase';
// Import des types
import { MenuItem } from '../types';

/**
 * Composant principal de la page Menu.
 * 
 * Ce composant gère l'affichage du menu, y compris le chargement des données,
 * la gestion des erreurs, et l'affichage des détails des éléments du menu.
 * 
 * @returns Le composant Menu
 */
const Menu = () => {
  // État pour stocker les éléments du menu
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  // État pour indiquer si les données sont en cours de chargement
  const [loading, setLoading] = useState<boolean>(true);
  // État pour stocker les erreurs éventuelles
  const [error, setError] = useState<string | null>(null);
  // État pour l'élément du menu sélectionné pour affichage détaillé
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  /**
   * Hook useEffect pour charger les données au chargement du composant.
   * 
   * Cette fonction est appelée une seule fois au montage du composant.
   */
  useEffect(() => {
    // Fonction asynchrone pour récupérer les éléments du menu
    const fetchMenuItems = async () => {
      try {
        // Indiquer que le chargement est en cours
        setLoading(true);
        // Récupérer les éléments du menu depuis Firebase
        const items = await getMenuItems();
        // Mettre à jour l'état avec les éléments récupérés
        setMenuItems(items);
        // Réinitialiser l'état d'erreur
        setError(null);
      } catch (err) {
        // En cas d'erreur, mettre à jour l'état d'erreur
        setError('Erreur lors du chargement du menu. Veuillez réessayer plus tard.');
        console.error('Error fetching menu items:', err);
      } finally {
        // Indiquer que le chargement est terminé
        setLoading(false);
      }
    };

    // Appeler la fonction de récupération des données
    fetchMenuItems();
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une seule fois au montage du composant

  /**
   * Regroupement des éléments du menu par catégorie.
   * 
   * Cette fonction utilise reduce pour créer un objet où les clés sont les catégories
   * et les valeurs sont les tableaux d'éléments.
   * 
   * @returns Un objet avec les catégories comme clés et les tableaux d'éléments comme valeurs
   */
  const menuByCategory = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    // Si la catégorie n'existe pas encore dans l'accumulateur, créer un tableau vide
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    // Ajouter l'élément à sa catégorie
    acc[item.category].push(item);
    return acc;
  }, {});

  /**
   * Récupération des catégories triées par ordre alphabétique.
   * 
   * Cette fonction utilise Object.keys pour récupérer les clés de l'objet menuByCategory,
   * puis sort pour trier les catégories par ordre alphabétique.
   * 
   * @returns Un tableau de catégories triées par ordre alphabétique
   */
  const categories = Object.keys(menuByCategory).sort();

  /**
   * Fonction pour ouvrir le modal avec les détails d'un élément.
   * 
   * Cette fonction est appelée lorsque l'utilisateur clique sur un élément du menu.
   * 
   * @param item L'élément du menu à afficher dans le modal
   */
  const openItemDetails = (item: MenuItem) => {
    setSelectedItem(item);
  };

  /**
   * Fonction pour fermer le modal.
   * 
   * Cette fonction est appelée lorsque l'utilisateur clique sur le bouton "Fermer"
   * du modal.
   */
  const closeItemDetails = () => {
    setSelectedItem(null);
  };

  // Affichage pendant le chargement des données
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Notre Menu</h1>
        <div className="flex justify-center items-center h-64">
          {/* Indicateur de chargement animé */}
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Notre Menu</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  // Affichage si aucun élément de menu n'est disponible
  if (menuItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Notre Menu</h1>
        <div className="text-center py-10">
          <p className="text-gray-600">Aucun élément de menu n'est disponible pour le moment.</p>
        </div>
      </div>
    );
  }

  // Affichage principal du menu
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Notre Menu</h1>
      
      {/* Parcourir chaque catégorie et afficher ses éléments */}
      {categories.map((category) => (
        <div key={category} className="mb-12">
          {/* Titre de la catégorie avec première lettre en majuscule */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 capitalize">
            {category}
          </h2>
          
          {/* Grille des éléments du menu pour cette catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuByCategory[category].map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => openItemDetails(item)}
              >
                {/* Image de l'élément du menu */}
                {item.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                
                {/* Contenu textuel de la carte */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <span className="text-emerald-600 font-medium">{item.price.toFixed(2)} €</span>
                  </div>
                  
                  {/* Description */}
                  <p className="mt-2 text-gray-600 text-sm line-clamp-2">{item.description}</p>
                  
                  {/* Indicateur de disponibilité */}
                  <div className="mt-4">
                    <span className={`text-sm ${item.available ? 'text-emerald-600' : 'text-red-600'}`}>
                      {item.available ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Modal pour afficher les détails d'un élément */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* En-tête du modal avec image */}
            {selectedItem.image && (
              <div className="relative h-64">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  className="w-full h-full object-cover"
                />
                {/* Bouton de fermeture */}
                <button 
                  onClick={closeItemDetails}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Contenu du modal */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">{selectedItem.name}</h2>
                <span className="text-xl text-emerald-600 font-medium">{selectedItem.price.toFixed(2)} €</span>
              </div>
              
              <p className="text-gray-700 mb-4">{selectedItem.description}</p>
              
              {/* Informations supplémentaires */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Catégorie:</span>
                  <span className="font-medium capitalize">{selectedItem.category}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Disponibilité:</span>
                  <span className={`font-medium ${selectedItem.available ? 'text-emerald-600' : 'text-red-600'}`}>
                    {selectedItem.available ? 'En stock' : 'Rupture de stock'}
                  </span>
                </div>
              </div>
              
              {/* Bouton de fermeture en bas */}
              <button 
                onClick={closeItemDetails}
                className="mt-6 w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export du composant Menu
export default Menu;