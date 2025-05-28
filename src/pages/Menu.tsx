// Import des hooks nécessaires
import { useState, useEffect } from 'react';
// Import du composant Link pour la navigation
import { Link } from 'react-router-dom';
// Import des fonctions Firebase
import { getMenuItems } from '../firebase';
// Import des types
import { MenuItem } from '../types';

/**
 * Composant principal de la page Menu.
 */
const Menu = () => {
  // État pour stocker les éléments du menu
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  // État pour l'élément du menu sélectionné pour affichage détaillé
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Charger les données au chargement du composant
  useEffect(() => {
    getMenuItems().then(setMenuItems);
  }, []);

  // Regrouper les éléments du menu par catégorie (version simplifiée)
  // On crée un objet vide qui va contenir nos catégories
  const menuByCategory: {[category: string]: MenuItem[]} = {};
  
  // On parcourt chaque plat du menu
  menuItems.forEach(item => {
    // Si la catégorie n'existe pas encore dans notre objet, on crée un tableau vide
    if (!menuByCategory[item.category]) {
      menuByCategory[item.category] = [];
    }
    
    // On ajoute le plat dans sa catégorie
    menuByCategory[item.category].push(item);
  });

  // Récupérer les catégories triées par ordre alphabétique
  const categories = Object.keys(menuByCategory).sort();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Notre Menu</h1>
      {categories.map((category: string) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuByCategory[category].map((item: MenuItem) => (
              <div
                key={item.id}
                className="card bg-base-100 shadow-md hover:shadow-xl cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {item.image && (
                  <figure>
                    <img src={item.image} alt={item.name} className="h-48 w-full object-cover" />
                  </figure>
                )}
                <div className="card-body">
                  <h3 className="card-title">{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="card-actions justify-end">
                    <span className="font-bold">{item.price} €</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Modal pour afficher les détails d'un élément */}
      {selectedItem && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            {/* En-tête du modal avec image */}
            {selectedItem.image && (
              <figure className="mb-4">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  className="w-full h-64 object-cover rounded-lg"
                />
              </figure>
            )}
            
            {/* Contenu du modal */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
              <span className="text-xl text-primary font-medium">{selectedItem.price.toFixed(2)} €</span>
            </div>
            
            <p className="mb-4">{selectedItem.description}</p>
            
            {/* Informations supplémentaires */}
            <div className="divider"></div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm">Catégorie:</div>
              <div className="text-sm font-medium capitalize text-right">{selectedItem.category}</div>
              
              <div className="text-sm">Disponibilité:</div>
              <div className="text-sm font-medium text-right">
                <span className={`badge ${selectedItem.available ? 'badge-success' : 'badge-error'}`}>
                  {selectedItem.available ? 'En stock' : 'Rupture de stock'}
                </span>
              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="modal-action">
              <button 
                onClick={() => setSelectedItem(null)}
                className="btn"
              >
                Fermer
              </button>
              <Link 
                to={`/menu/${selectedItem.id}`} 
                className="btn btn-primary"
              >
                Voir page détaillée
              </Link>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setSelectedItem(null)}></div>
        </div>
      )}
    </div>
  );
};

export default Menu;