// Import de la fonction pour ajouter des éléments au menu depuis firebase.ts
import { addMenuItem, deleteAllMenuItems } from './firebase';
// Import du type MenuItem depuis types.ts
import { MenuItem } from './types';

// Fonction pour initialiser les données du menu dans Firebase
// Cette fonction crée des éléments de menu prédéfinis et les ajoute à la base de données
/**
 * Fonction d'initialisation des données du menu.
 * Cette fonction crée des éléments de menu prédéfinis et les ajoute à la base de données.
 * @returns {Promise<void>}
 */
export const initializeMenuData = async () => {
  // Tableau d'éléments de menu à ajouter
  // Omit<MenuItem, 'id'> signifie "tous les champs de MenuItem sauf id"
  // car l'id sera généré automatiquement par Firebase
  /**
   * Tableau d'éléments de menu à ajouter.
   * @type {Omit<MenuItem, 'id'>[]}
   */
  const menuItems: Omit<MenuItem, 'id'>[] = [
    // Entrées
    {
      name: 'Foie Gras Maison',
      description: 'Foie gras mi-cuit, chutney de figues et pain brioché toasté',
      price: 18.50,
      category: 'entrées',
      available: true,
      image: 'https://images.pexels.com/photos/8696567/pexels-photo-8696567.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Salade de Chèvre Chaud',
      description: 'Salade verte, toasts de chèvre, miel, noix et vinaigrette balsamique',
      price: 12.90,
      category: 'entrées',
      available: true,
      image: 'https://images.pexels.com/photos/5419336/pexels-photo-5419336.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Carpaccio de Saint-Jacques',
      description: 'Fines tranches de Saint-Jacques, huile d\'olive citronnée et fleur de sel',
      price: 16.90,
      category: 'entrées',
      available: true,
      image: 'https://images.pexels.com/photos/4553031/pexels-photo-4553031.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    
    // Plats principaux
    {
      name: 'Filet de Bœuf Rossini',
      description: 'Filet de bœuf, escalope de foie gras poêlée, sauce aux truffes et purée maison',
      price: 32.50,
      category: 'plats',
      available: true,
      image: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Magret de Canard',
      description: 'Magret de canard rôti, sauce au miel et aux épices, pommes de terre sarladaises',
      price: 26.90,
      category: 'plats',
      available: true,
      image: 'https://images.pexels.com/photos/6607314/pexels-photo-6607314.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Risotto aux Cèpes',
      description: 'Risotto crémeux aux cèpes et parmesan, huile de truffe',
      price: 22.90,
      category: 'plats',
      available: true,
      image: 'https://images.pexels.com/photos/6419736/pexels-photo-6419736.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    
    // Desserts
    {
      name: 'Crème Brûlée à la Vanille',
      description: 'Crème brûlée à la vanille de Madagascar',
      price: 9.90,
      category: 'desserts',
      available: true,
      image: 'https://images.pexels.com/photos/8250190/pexels-photo-8250190.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Fondant au Chocolat',
      description: 'Fondant au chocolat noir, cœur coulant et glace vanille',
      price: 10.50,
      category: 'desserts',
      available: true,
      image: 'https://images.pexels.com/photos/5386673/pexels-photo-5386673.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Tarte Tatin',
      description: 'Tarte tatin aux pommes caramélisées et crème fraîche',
      price: 9.50,
      category: 'desserts',
      available: true,
      image: 'https://images.pexels.com/photos/6133305/pexels-photo-6133305.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    
    // Boissons
    {
      name: 'Vin Rouge - Bordeaux Saint-Émilion',
      description: 'Bouteille 75cl, Grand cru classé',
      price: 45.00,
      category: 'boissons',
      available: true,
      image: 'https://images.pexels.com/photos/2912108/pexels-photo-2912108.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Vin Blanc - Chablis',
      description: 'Bouteille 75cl, Domaine William Fèvre',
      price: 38.00,
      category: 'boissons',
      available: true,
      image: 'https://images.pexels.com/photos/1123260/pexels-photo-1123260.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Eau Minérale',
      description: 'Bouteille 75cl, plate ou gazeuse',
      price: 4.50,
      category: 'boissons',
      available: true,
      image: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  // Boucle pour ajouter chaque élément du menu à Firebase
  /**
   * Boucle pour ajouter chaque élément du menu à Firebase.
   * @description Cette boucle utilise la fonction addMenuItem pour ajouter chaque élément du menu à la base de données.
   */
  for (const item of menuItems) {
    try {
      // Appel de la fonction addMenuItem définie dans firebase.ts
      /**
       * Appel de la fonction addMenuItem pour ajouter l'élément du menu à la base de données.
       * @description Cette fonction retourne l'id de l'élément ajouté.
       */
      const id = await addMenuItem(item);
      console.log(`Élément ajouté avec succès: ${item.name} (ID: ${id})`);
    } catch (error) {
      // Gestion des erreurs
      /**
       * Gestion des erreurs lors de l'ajout d'un élément du menu.
       * @description Cette partie du code gère les erreurs qui peuvent survenir lors de l'ajout d'un élément du menu.
       */
      console.error(`Erreur lors de l'ajout de ${item.name}:`, error);
    }
  }

  console.log('Initialisation des données terminée');
};

// Fonction principale pour exécuter l'initialisation
// Cette fonction est appelée depuis la page Admin
/**
 * Fonction principale pour exécuter l'initialisation.
 * @description Cette fonction est appelée depuis la page Admin pour initialiser les données du menu.
 * @returns {Promise<void>}
 */
export const runInitialization = async () => {
  try {
    console.log('Démarrage de l\'initialisation des données...');
    
    // Supprimer tous les éléments existants pour éviter les doublons
    console.log('Suppression des éléments existants...');
    await deleteAllMenuItems();
    console.log('Suppression terminée.');
    
    // Appel de la fonction d'initialisation du menu
    /**
     * Appel de la fonction d'initialisation du menu.
     * @description Cette fonction initialise les données du menu en ajoutant les éléments du menu à la base de données.
     */
    await initializeMenuData();
    console.log('Initialisation réussie!');
  } catch (error) {
    // Gestion des erreurs globales
    /**
     * Gestion des erreurs globales lors de l'initialisation.
     * @description Cette partie du code gère les erreurs qui peuvent survenir lors de l'initialisation des données du menu.
     */
    console.error('Erreur lors de l\'initialisation:', error);
  }
};
