// Import des hooks nécessaires
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
// Import de la fonction pour récupérer les éléments du menu depuis Firebase
import { getMenuItems, addOrder } from '../firebase';
// Import du type MenuItem
import { MenuItem } from '../types';
// Import des icônes utilisées dans l'interface
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
// Import de la fonction toast pour afficher des notifications
import { toast } from 'react-hot-toast';

// Interface définissant la structure d'un élément du panier
// Combine un élément du menu avec une quantité
interface CartItem {
  menuItem: MenuItem;  // L'élément du menu
  quantity: number;    // La quantité commandée
}

// Composant principal de la page de commande
const Order = () => {
  // État pour stocker les éléments du menu récupérés de Firebase
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  // État pour indiquer si les données sont en cours de chargement
  const [loading, setLoading] = useState<boolean>(true);
  // État pour stocker les erreurs éventuelles
  const [error, setError] = useState<string | null>(null);
  // État pour stocker les éléments du panier
  const [cart, setCart] = useState<CartItem[]>([]);
  // État pour stocker les informations du client
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });
  // État pour suivre quelle catégorie est actuellement active
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  // État pour indiquer si une commande est en cours d'envoi
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Hook useEffect pour charger les données au chargement du composant
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Indique que le chargement est en cours
        setLoading(true);
        // Appel à la fonction getMenuItems de firebase.ts
        const items = await getMenuItems();
        setMenuItems(items);
        
        // Définir la première catégorie comme active par défaut
        if (items.length > 0) {
          // Récupération des catégories uniques
          const categories = [...new Set(items.map(item => item.category))];
          if (categories.length > 0) {
            setActiveCategory(categories[0]);
          }
        }
        
        // Réinitialisation de l'état d'erreur
        setError(null);
      } catch (err) {
        // En cas d'erreur, on stocke le message d'erreur
        setError('Erreur lors du chargement du menu. Veuillez réessayer plus tard.');
        console.error('Error fetching menu items:', err);
      } finally {
        // Qu'il y ait une erreur ou non, on indique que le chargement est terminé
        setLoading(false);
      }
    };

    // Appel de la fonction de récupération des données
    fetchMenuItems();
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une seule fois au montage du composant

  // Regroupement des éléments du menu par catégorie
  const menuByCategory = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Récupération des catégories triées par ordre alphabétique
  const categories = Object.keys(menuByCategory).sort();

  // Fonction pour ajouter un élément au panier
  const addToCart = (menuItem: MenuItem) => {
    setCart(prevCart => {
      // Vérifier si l'élément est déjà dans le panier
      const existingItem = prevCart.find(item => item.menuItem.id === menuItem.id);
      
      if (existingItem) {
        // Si l'élément existe déjà, augmenter sa quantité
        return prevCart.map(item => 
          item.menuItem.id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 } // Augmenter la quantité
            : item // Laisser les autres éléments inchangés
        );
      } else {
        // Si l'élément n'existe pas encore, l'ajouter avec une quantité de 1
        return [...prevCart, { menuItem, quantity: 1 }];
      }
    });
    
    // Afficher une notification de succès
    toast.success(`${menuItem.name} ajouté au panier`);
  };

  // Fonction pour supprimer un élément du panier
  const removeFromCart = (menuItemId: string) => {
    // Filtrer le panier pour enlever l'élément avec l'ID spécifié
    setCart(prevCart => prevCart.filter(item => item.menuItem.id !== menuItemId));
    toast.success('Article retiré du panier');
  };

  // Fonction pour mettre à jour la quantité d'un élément dans le panier
  const updateQuantity = (menuItemId: string, newQuantity: number) => {
    // Vérifier que la nouvelle quantité est au moins 1
    if (newQuantity < 1) return;
    
    // Mettre à jour la quantité de l'élément spécifié
    setCart(prevCart => 
      prevCart.map(item => 
        item.menuItem.id === menuItemId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  // Fonction pour calculer le montant total du panier
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  };

  // Fonction pour gérer les changements dans le formulaire d'informations client
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  // Fonction pour gérer la soumission de la commande
  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    
    // Vérifier que le panier n'est pas vide
    if (cart.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    // Vérifier que les informations client sont complètes
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Veuillez remplir au moins votre nom et numéro de téléphone');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Préparer les données de la commande
      const orderData = {
        items: cart.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          name: item.menuItem.name,
          price: item.menuItem.price
        })),
        status: 'pending' as const,
        timestamp: new Date(),
        total: calculateTotal(),
        userId: 'guest', // Pour l'instant, toutes les commandes sont passées en tant qu'invité
        customerInfo: {
          ...customerInfo
        }
      };
      
      console.log('Envoi de la commande:', orderData);
      
      // Envoyer la commande à Firebase
      const orderId = await addOrder(orderData);
      
      console.log('Résultat de l\'envoi de la commande:', orderId);
      
      if (orderId) {
        toast.success('Commande envoyée avec succès!');
        
        // Réinitialiser le panier et le formulaire
        setCart([]);
        setCustomerInfo({
          name: '',
          phone: '',
          email: '',
          address: '',
          notes: ''
        });
      } else {
        toast.error('Erreur lors de l\'envoi de la commande. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Affichage pendant le chargement des données
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Commander</h1>
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Commander</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  // Affichage principal de la page de commande
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Commander</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Section du menu (occupe 2/3 de la largeur sur grand écran) */}
        <div className="lg:col-span-2">
          {/* Sélecteur de catégories */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-emerald-600 text-white' // Style pour la catégorie active
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200' // Style pour les catégories inactives
                  }`}
                >
                  {/* Première lettre en majuscule */}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Affichage des éléments du menu de la catégorie active */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {activeCategory || 'Tous les plats'}
            </h2>
            
            <div className="divide-y divide-gray-200">
              {/* Afficher uniquement les éléments de la catégorie active */}
              {activeCategory && menuByCategory[activeCategory]?.map(item => (
                <div key={item.id} className="py-4 flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                    <p className="mt-1 text-emerald-600 font-medium">{item.price.toFixed(2)} €</p>
                  </div>
                  {/* Bouton d'ajout au panier (désactivé si l'élément n'est pas disponible) */}
                  {item.available ? (
                    <button
                      onClick={() => addToCart(item)}
                      className="ml-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                    >
                      Ajouter
                    </button>
                  ) : (
                    <span className="ml-4 px-4 py-2 bg-gray-200 text-gray-500 rounded cursor-not-allowed">
                      Indisponible
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Section du panier (occupe 1/3 de la largeur sur grand écran) */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <ShoppingBag className="h-6 w-6 mr-2" />
              Votre Panier
            </h2>
            
            {/* Affichage différent selon que le panier est vide ou non */}
            {cart.length === 0 ? (
              <p className="text-gray-500 py-4">Votre panier est vide</p>
            ) : (
              <>
                {/* Liste des éléments du panier */}
                <div className="divide-y divide-gray-200 mb-6">
                  {cart.map(item => (
                    <div key={item.menuItem.id} className="py-3">
                      {/* En-tête de l'élément avec nom et bouton de suppression */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-md font-medium">{item.menuItem.name}</h3>
                          <p className="text-sm text-gray-500">{item.menuItem.price.toFixed(2)} € / unité</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.menuItem.id)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Supprimer"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      {/* Contrôle de quantité et prix total de l'élément */}
                      <div className="mt-2 flex items-center">
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                          className="text-gray-500 hover:text-emerald-600"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                          className="text-gray-500 hover:text-emerald-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <span className="ml-auto font-medium">
                          {(item.menuItem.price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Affichage du total du panier */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{calculateTotal().toFixed(2)} €</span>
                  </div>
                </div>
              </>
            )}
            
            {/* Formulaire d'informations client */}
            <form onSubmit={handleSubmitOrder} className="mt-6">
              <h3 className="text-lg font-medium mb-4">Vos Informations</h3>
              
              <div className="space-y-4">
                {/* Champ Nom */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                {/* Champ Téléphone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                {/* Champ Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                {/* Champ Adresse */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse de livraison</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                {/* Champ Notes (instructions spéciales) */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Instructions spéciales</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={customerInfo.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  ></textarea>
                </div>
              </div>
              
              {/* Bouton de soumission de la commande (désactivé si le panier est vide ou si une commande est en cours d'envoi) */}
              <button
                type="submit"
                className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                disabled={cart.length === 0 || isSubmitting}
              >
                Passer la commande
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export du composant Order
export default Order;