// Interface définissant la structure d'un élément du menu
// Une interface en TypeScript définit la forme que doit avoir un objet
export interface MenuItem {
  id: string;         // Identifiant unique de l'élément (généré par Firebase)
  name: string;       // Nom du plat
  description: string; // Description détaillée du plat
  price: number;      // Prix du plat (en euros)
  category: string;   // Catégorie du plat (entrées, plats, desserts, boissons)
  available: boolean; // Indique si le plat est disponible ou non
  image: string;      // URL de l'image du plat
}

// Interface définissant la structure d'une commande
export interface Order {
  id: string;         // Identifiant unique de la commande (généré par Firebase)
  items: {            // Tableau des éléments commandés
    menuItemId: string; // ID de l'élément du menu
    quantity: number;   // Quantité commandée
    name: string;       // Nom de l'élément (pour affichage sans avoir à charger le menu)
    price: number;      // Prix de l'élément (pour calcul sans avoir à charger le menu)
  }[];
  status: 'pending' | 'preparing' | 'ready' | 'completed'; // Statut de la commande (union de types)
  timestamp: Date;    // Date et heure de la commande
  total: number;      // Montant total de la commande
  userId: string;     // ID de l'utilisateur qui a passé la commande
  customerInfo?: {    // Informations sur le client (optionnel)
    name: string;     // Nom du client
    phone: string;    // Numéro de téléphone du client
    email?: string;   // Email du client (optionnel)
    address?: string; // Adresse du client (optionnel)
    notes?: string;   // Notes spéciales pour la commande (optionnel)
  };
}