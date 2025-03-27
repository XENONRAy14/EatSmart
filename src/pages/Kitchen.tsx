import { useState, useEffect } from 'react';
import { getOrdersByStatus, updateOrderStatus, getMenuItems, addOrder, deleteOrder } from '../firebase';
import { Order, MenuItem } from '../types';
import { Check, ChefHat, Bell, Truck, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Interface pour les commandes enrichies avec les détails des articles
interface EnrichedOrder extends Order {
  itemDetails: {
    menuItemId: string;
    quantity: number;
    name: string;
    price: number;
  }[];
}

const Kitchen = () => {
  // États pour stocker les différentes commandes par statut
  const [pendingOrders, setPendingOrders] = useState<EnrichedOrder[]>([]);
  const [preparingOrders, setPreparingOrders] = useState<EnrichedOrder[]>([]);
  const [readyOrders, setReadyOrders] = useState<EnrichedOrder[]>([]);
  
  // État pour le chargement
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // État pour stocker tous les articles du menu (pour référence future)
  // Nous gardons cette variable même si elle n'est pas utilisée actuellement
  // car elle pourrait être utile pour afficher des informations supplémentaires sur les plats
  // ou pour implémenter des fonctionnalités futures comme la recherche de plats
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
  // Fonction pour charger les commandes
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Récupérer les commandes par statut
      const pending = await getOrdersByStatus('pending');
      const preparing = await getOrdersByStatus('preparing');
      const ready = await getOrdersByStatus('ready');
      
      console.log('Commandes en attente:', pending);
      console.log('Commandes en préparation:', preparing);
      console.log('Commandes prêtes:', ready);
      
      // Récupérer tous les articles du menu pour référence future si nécessaire
      const items = await getMenuItems();
      setMenuItems(items);
      
      // Convertir les commandes en commandes enrichies
      setPendingOrders(pending as EnrichedOrder[]);
      setPreparingOrders(preparing as EnrichedOrder[]);
      setReadyOrders(ready as EnrichedOrder[]);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Impossible de charger les commandes. Veuillez réessayer plus tard.');
      setLoading(false);
    }
  };
  
  // Fonction pour créer une commande de test
  const createTestOrder = async () => {
    try {
      // Récupérer quelques articles du menu pour la commande de test
      const items = await getMenuItems();
      
      if (items.length === 0) {
        toast.error('Aucun article de menu disponible. Veuillez d\'abord initialiser le menu.');
        return;
      }
      
      // Prendre les 2 premiers articles du menu
      const testItems = items.slice(0, 2).map(item => ({
        menuItemId: item.id,
        quantity: 1,
        name: item.name,
        price: item.price
      }));
      
      // Créer une commande de test
      const orderData = {
        items: testItems,
        status: 'pending' as const,
        timestamp: new Date(),
        total: testItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        userId: 'test-user',
        customerInfo: {
          name: 'Client Test',
          phone: '0123456789',
          email: 'test@example.com',
          notes: 'Ceci est une commande de test'
        }
      };
      
      // Envoyer la commande à Firebase
      const orderId = await addOrder(orderData);
      
      if (orderId) {
        toast.success('Commande de test créée avec succès!');
        // Rafraîchir les commandes
        fetchOrders();
      } else {
        toast.error('Erreur lors de la création de la commande de test');
      }
    } catch (err) {
      console.error('Error creating test order:', err);
      toast.error('Une erreur est survenue lors de la création de la commande de test');
    }
  };
  
  // Charger les commandes au chargement du composant et toutes les 30 secondes
  useEffect(() => {
    fetchOrders();
    
    // Mettre en place un intervalle pour rafraîchir les commandes
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000); // 30 secondes
    
    // Nettoyer l'intervalle quand le composant est démonté
    return () => clearInterval(interval);
  }, []);
  
  // Fonction pour mettre à jour le statut d'une commande
  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const success = await updateOrderStatus(orderId, newStatus);
      
      if (success) {
        toast.success(`Statut de la commande mis à jour: ${newStatus}`);
        // Rafraîchir les commandes
        fetchOrders();
      } else {
        toast.error('Erreur lors de la mise à jour du statut de la commande');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    }
  };
  
  // Fonction pour supprimer une commande
  const handleDeleteOrder = async (orderId: string) => {
    // Demander confirmation avant de supprimer
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible.')) {
      try {
        const success = await deleteOrder(orderId);
        
        if (success) {
          toast.success('Commande annulée avec succès');
          // Rafraîchir les commandes
          fetchOrders();
        } else {
          toast.error('Erreur lors de l\'annulation de la commande');
        }
      } catch (err) {
        console.error('Error deleting order:', err);
        toast.error('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  };
  
  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Composant pour afficher une commande
  const OrderCard = ({ order, status }: { order: EnrichedOrder, status: Order['status'] }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">
              Commande #{order.id.substring(0, 6)}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(order.timestamp)}
            </p>
          </div>
          <div className="text-right">
            <span className="font-bold text-emerald-600">{order.total.toFixed(2)} €</span>
            {order.customerInfo && (
              <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
            )}
          </div>
        </div>
        
        <div className="border-t border-b border-gray-200 py-3 my-3">
          <h4 className="font-medium mb-2">Articles:</h4>
          <ul className="space-y-2">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>
                  <span className="font-medium">{item.quantity}x</span> {item.name}
                </span>
                <span className="text-gray-600">{(item.price * item.quantity).toFixed(2)} €</span>
              </li>
            ))}
          </ul>
        </div>
        
        {order.customerInfo && order.customerInfo.notes && (
          <div className="mb-3">
            <h4 className="font-medium">Notes:</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{order.customerInfo.notes}</p>
          </div>
        )}
        
        <div className="flex justify-between mt-4">
          {status === 'pending' && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdateStatus(order.id, 'preparing')}
                className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
              >
                <ChefHat size={18} className="mr-2" />
                Commencer la préparation
              </button>
              
              <button
                onClick={() => handleDeleteOrder(order.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Trash2 size={18} className="mr-2" />
                Annuler
              </button>
            </div>
          )}
          
          {status === 'preparing' && (
            <button
              onClick={() => handleUpdateStatus(order.id, 'ready')}
              className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Check size={18} className="mr-2" />
              Marquer comme prêt
            </button>
          )}
          
          {status === 'ready' && (
            <button
              onClick={() => handleUpdateStatus(order.id, 'completed')}
              className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Truck size={18} className="mr-2" />
              Marquer comme livré
            </button>
          )}
        </div>
      </div>
    );
  };
  
  // Affichage pendant le chargement
  if (loading && pendingOrders.length === 0 && preparingOrders.length === 0 && readyOrders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Cuisine</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }
  
  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Cuisine</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Tableau de bord cuisine</h1>
        <div className="flex space-x-4">
          <button
            onClick={createTestOrder}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Créer commande test
          </button>
          <button
            onClick={fetchOrders}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Actualiser
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne des commandes en attente */}
        <div>
          <div className="bg-yellow-100 p-4 rounded-t-lg flex items-center">
            <Bell size={20} className="text-yellow-600 mr-2" />
            <h2 className="text-xl font-semibold text-yellow-800">En attente ({pendingOrders.length})</h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-b-lg max-h-[calc(100vh-220px)] overflow-y-auto">
            {pendingOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune commande en attente</p>
            ) : (
              pendingOrders.map(order => (
                <OrderCard key={order.id} order={order} status="pending" />
              ))
            )}
          </div>
        </div>
        
        {/* Colonne des commandes en préparation */}
        <div>
          <div className="bg-blue-100 p-4 rounded-t-lg flex items-center">
            <ChefHat size={20} className="text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-blue-800">En préparation ({preparingOrders.length})</h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-b-lg max-h-[calc(100vh-220px)] overflow-y-auto">
            {preparingOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune commande en préparation</p>
            ) : (
              preparingOrders.map(order => (
                <OrderCard key={order.id} order={order} status="preparing" />
              ))
            )}
          </div>
        </div>
        
        {/* Colonne des commandes prêtes */}
        <div>
          <div className="bg-green-100 p-4 rounded-t-lg flex items-center">
            <Check size={20} className="text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-green-800">Prêt à servir ({readyOrders.length})</h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-b-lg max-h-[calc(100vh-220px)] overflow-y-auto">
            {readyOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune commande prête</p>
            ) : (
              readyOrders.map(order => (
                <OrderCard key={order.id} order={order} status="ready" />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kitchen;