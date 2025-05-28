import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMenuItemById } from '../firebase';
import { MenuItem } from '../types';

/**
 * Composant pour afficher les détails d'un élément du menu spécifique.
 * Récupère l'ID de l'élément depuis les paramètres de l'URL et affiche ses détails.
 */
const MenuItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (id) {
      getMenuItemById(id).then(setMenuItem);
    }
  }, [id]);

  if (!menuItem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Plat non trouvé.</p>
        <div className="mt-6">
          <Link to="/menu" className="text-emerald-600 hover:text-emerald-800">
            &larr; Retour au menu
          </Link>
        </div>
      </div>
    );
  }

  // Affichage des détails du plat
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image du plat */}
        {menuItem.image && (
          <div className="h-64 sm:h-96 w-full">
            <img 
              src={menuItem.image} 
              alt={menuItem.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Contenu détaillé */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-semibold text-gray-900">{menuItem.name}</h1>
            <span className="text-2xl text-emerald-600 font-medium">{menuItem.price.toFixed(2)} €</span>
          </div>
          
          <p className="text-gray-700 mb-6 text-lg">{menuItem.description}</p>
          
          {/* Informations supplémentaires */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-base">
              <span className="text-gray-600">Catégorie:</span>
              <span className="font-medium capitalize">{menuItem.category}</span>
            </div>
            <div className="flex justify-between text-base mt-3">
              <span className="text-gray-600">Disponibilité:</span>
              <span className={`font-medium ${menuItem.available ? 'text-emerald-600' : 'text-red-600'}`}>
                {menuItem.available ? 'En stock' : 'Rupture de stock'}
              </span>
            </div>
          </div>
          
          {/* Bouton retour */}
          <div className="mt-8">
            <Link 
              to="/menu" 
              className="inline-flex items-center text-emerald-600 hover:text-emerald-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Retour au menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetail;
