// Imports nécessaires
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { getMenuItems, addOrder } from '../firebase';
import { MenuItem } from '../types';

// Un élément du panier contient un plat et sa quantité
type CartItem = {
  menuItem: MenuItem;
  quantity: number;
};

// Page de commande
const Order = () => {
  // Données du menu et du panier
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Informations du client
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  
  // États pour l'interface
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Charger le menu quand la page s'ouvre
  useEffect(() => {
    setIsLoading(true);
    getMenuItems()
      .then(items => {
        setMenuItems(items);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setError('Impossible de charger le menu. Veuillez réessayer plus tard.');
        setIsLoading(false);
      });
  }, []);

  // Organiser les plats par catégorie
  const menuByCategory = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
  
  const categories = Object.keys(menuByCategory);
  const [activeCategory, setActiveCategory] = useState("");

  // Ajouter un plat au panier
  const addToCart = (menuItem: MenuItem) => {
    setCart(prevCart => {
      // Vérifier si le plat est déjà dans le panier
      const existing = prevCart.find(item => item.menuItem.id === menuItem.id);
      
      if (existing) {
        // Si oui, augmenter la quantité de 1
        return prevCart.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Sinon, ajouter le plat avec quantité 1
      return [...prevCart, { menuItem, quantity: 1 }];
    });
  };

  // Supprimer un plat du panier
  const removeFromCart = (menuItemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.menuItem.id !== menuItemId));
  };

  // Changer la quantité d'un plat
  const updateQuantity = (menuItemId: string, newQuantity: number) => {
    // La quantité doit être au moins 1
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.menuItem.id === menuItemId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  // Calculer le total du panier
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  };

  // Mettre à jour les infos client quand on tape dans un champ
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  // Envoyer la commande
  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Vérifications de base
    if (cart.length === 0) {
      setIsSubmitting(false);
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Préparer la commande
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
        userId: 'guest',
        customerInfo: {
          ...customerInfo
        }
      };
      
      // Envoyer la commande à Firebase
      const orderId = await addOrder(orderData);

      if (orderId) {
        // Réinitialiser après succès
        setCart([]);
        setCustomerInfo({
          name: '',
          phone: '',
          address: '',
          notes: ''
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        alert('Erreur lors de l\'envoi de la commande. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher un chargement ou une erreur si nécessaire
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Commander</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Commander</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erreur: </strong>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Affichage de la page
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Commander</h1>
      
      {/* Message de succès */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded text-center">Commande envoyée avec succès !</div>
      )}
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Menu (2/3 de l'écran) */}
        <div className="lg:col-span-2">
          {/* Filtres par catégorie */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              <button
                className={`px-4 py-2 rounded ${activeCategory === '' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setActiveCategory("")}
              >
                Tous les plats
              </button>
              
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded ${activeCategory === category ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Liste des plats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {activeCategory || 'Tous les plats'}
            </h2>
            
            <div className="divide-y divide-gray-200">
              {/* Afficher les plats de la catégorie sélectionnée ou tous les plats */}
              {(activeCategory ? menuByCategory[activeCategory] : menuItems)?.map(item => (
                <div key={item.id} className="py-4 flex justify-between items-center">
                  {/* Infos du plat */}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                    <p className="mt-1 text-emerald-600 font-medium">{item.price.toFixed(2)} €</p>
                  </div>
                  
                  {/* Bouton d'ajout */}
                  {item.available ? (
                    <button
                      onClick={() => addToCart(item)}
                      className="ml-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
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
        
        {/* Panier (1/3 de l'écran) */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-semibold mb-4">Votre Panier</h2>
            
            {cart.length > 0 ? (
              <div>
                {/* Liste des articles du panier */}
                {cart.map(item => (
                  <div key={item.menuItem.id} className="py-4 flex justify-between items-center">
                    {/* Nom du plat */}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{item.menuItem.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{item.menuItem.description}</p>
                    </div>
                    
                    {/* Contrôles de quantité */}
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)} 
                        className="px-2 py-1 bg-gray-200 rounded" 
                        disabled={item.quantity === 1}
                      >
                        -
                      </button>
                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)} 
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.menuItem.id)} 
                        className="px-2 py-1 bg-red-200 rounded text-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                    
                    {/* Prix */}
                    <span className="ml-4 font-medium">
                      {(item.menuItem.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
                
                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{calculateTotal().toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 py-4">Votre panier est vide</div>
            )}
            
            {/* Formulaire client */}
            <form onSubmit={handleSubmitOrder} className="mt-6">
              <h3 className="text-lg font-medium mb-4">Vos Informations</h3>
              
              <div className="space-y-4">                
                {/* Nom */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium">Nom</label>
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
                
                {/* Téléphone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium">Téléphone</label>
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
                
                {/* Adresse */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium">Adresse de livraison</label>
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
                
                {/* Instructions spéciales */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium">Instructions spéciales</label>
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
              
              {/* Bouton de commande */}
              <button
                type="submit"
                className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none"
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