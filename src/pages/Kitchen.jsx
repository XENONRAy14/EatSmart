import { useState, useEffect } from 'react';
import { getOrdersByStatus, updateOrderStatus } from '../firebase';

// Composant Kitchen simplifié pour l'examen
const Kitchen = () => {
  // États pour stocker les commandes
  const [pendingOrders, setPendingOrders] = useState([]);
  const [preparingOrders, setPreparingOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);

  // Fonction simple pour récupérer les commandes
  const fetchOrders = async () => {
    try {
      // Récupère les commandes par statut
      const pending = await getOrdersByStatus('pending');
      const preparing = await getOrdersByStatus('preparing');
      const ready = await getOrdersByStatus('ready');
      
      // Met à jour les états
      setPendingOrders(pending);
      setPreparingOrders(preparing);
      setReadyOrders(ready);
    } catch (error) {
      // En cas d'erreur, affiche dans la console
      console.error("Erreur:", error);
    }
  };

  // Exécute fetchOrders au chargement et toutes les 30 secondes
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fonction simple pour changer le statut d'une commande
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Rafraîchit les commandes
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  // Fonction simple pour formater une date
  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    
    try {
      // Pour les timestamps Firestore
      if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleString('fr-FR');
      }
      // Pour les dates normales
      return new Date(timestamp).toLocaleString('fr-FR');
    } catch (error) {
      return '-';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Tableau de bord cuisine</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne En attente */}
        <div>
          <div className="bg-yellow-100 p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold text-yellow-800">En attente ({pendingOrders.length})</h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-b-lg max-h-[calc(100vh-220px)] overflow-y-auto">
            {pendingOrders.length === 0 ? (
              <p className="text-gray-500">Aucune commande en attente.</p>
            ) : (
              pendingOrders.map((order, index) => (
                <div key={order.id || index} className="mb-4 p-4 bg-white rounded shadow">
                  {/* Nom du client */}
                  <div className="font-semibold">{order.customerInfo?.name || 'Client'}</div>
                  {/* Date de la commande */}
                  <div className="text-xs text-gray-500 mb-2">{formatDate(order.timestamp)}</div>
                  
                  {/* Détails commande */}
                  <div className="mb-2">
                    <div className="font-semibold text-xs text-gray-700 mb-1">Détails :</div>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, i) => (
                        <div key={i}>{item.name || 'Plat'} x {item.quantity || 1}</div>
                      ))
                    ) : (
                      <div className="text-gray-400">Aucun plat</div>
                    )}
                  </div>
                  
                  {/* Infos client */}
                  <div className="text-xs text-gray-600 space-y-1 mb-2">
                    <div><span className="font-semibold">Téléphone:</span> {order.customerInfo?.phone || '-'}</div>
                    <div><span className="font-semibold">Total:</span> {order.total ? order.total.toFixed(2) + ' €' : '-'}</div>
                  </div>
                  
                  {/* Bouton d'action */}
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'preparing')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                  >
                    Commencer la préparation
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Colonne En préparation */}
        <div>
          <div className="bg-blue-100 p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold text-blue-800">En préparation ({preparingOrders.length})</h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-b-lg max-h-[calc(100vh-220px)] overflow-y-auto">
            {preparingOrders.length === 0 ? (
              <p className="text-gray-500">Aucune commande en préparation.</p>
            ) : (
              preparingOrders.map((order, index) => (
                <div key={order.id || index} className="mb-4 p-4 bg-white rounded shadow">
                  <div className="font-semibold">{order.customerInfo?.name || 'Client'}</div>
                  <div className="text-xs text-gray-500 mb-2">{formatDate(order.timestamp)}</div>
                  
                  <div className="mb-2">
                    <div className="font-semibold text-xs text-gray-700 mb-1">Détails :</div>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, i) => (
                        <div key={i}>{item.name || 'Plat'} x {item.quantity || 1}</div>
                      ))
                    ) : (
                      <div className="text-gray-400">Aucun plat</div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'ready')}
                    className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                  >
                    Marquer comme prêt
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Colonne Prêtes */}
        <div>
          <div className="bg-green-100 p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold text-green-800">Prêt à servir ({readyOrders.length})</h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-b-lg max-h-[calc(100vh-220px)] overflow-y-auto">
            {readyOrders.length === 0 ? (
              <p className="text-gray-500">Aucune commande prête.</p>
            ) : (
              readyOrders.map((order, index) => (
                <div key={order.id || index} className="mb-4 p-4 bg-white rounded shadow">
                  <div className="font-semibold">{order.customerInfo?.name || 'Client'}</div>
                  <div className="text-xs text-gray-500 mb-2">{formatDate(order.timestamp)}</div>
                  
                  <div className="mb-2">
                    <div className="font-semibold text-xs text-gray-700 mb-1">Détails :</div>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, i) => (
                        <div key={i}>{item.name || 'Plat'} x {item.quantity || 1}</div>
                      ))
                    ) : (
                      <div className="text-gray-400">Aucun plat</div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'completed')}
                    className="bg-purple-500 text-white px-4 py-2 rounded-md mt-2"
                  >
                    Marquer comme livré
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Fin du contenu principal */}
    </div>
  );
};

export default Kitchen;
