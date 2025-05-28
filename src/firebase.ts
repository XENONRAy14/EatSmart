// Importation des fonctions nécessaires de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, Timestamp, serverTimestamp, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
// Import du type MenuItem défini dans types.ts
import { MenuItem, Order } from './types';

// Configuration de Firebase avec les clés d'API et identifiants de votre projet
// Ces informations sont chargées depuis les variables d'environnement pour plus de sécurité
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);
// Création d'une instance de Firestore (base de données)
export const db = getFirestore(app);
// Création d'une instance d'authentification Firebase
export const auth = getAuth(app);

// Référence à la collection "menu" dans Firestore
// Une collection est comme une table dans une base de données relationnelle
const menuCollection = collection(db, 'menu');
// Référence à la collection "orders" dans Firestore
const ordersCollection = collection(db, 'orders');

// Fonction pour se connecter avec email et mot de passe
export const loginWithEmailAndPassword = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return null;
  }
};

// Fonction pour se déconnecter
export const logoutUser = async (): Promise<boolean> => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    return false;
  }
};

// Fonction pour vérifier si l'utilisateur est un administrateur
// Cette fonction vérifie simplement si l'utilisateur est connecté
// Dans une application réelle, vous pourriez vérifier un rôle spécifique dans une collection "users"
export const isUserAdmin = (user: User | null): boolean => {
  // Pour l'instant, nous considérons que tout utilisateur connecté est un administrateur
  // Vous pourriez améliorer cela en vérifiant une liste d'emails autorisés ou une collection "admins"
  return !!user;
};

// Fonction pour obtenir l'utilisateur actuel
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Fonction pour écouter les changements d'état d'authentification
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

// Fonction pour récupérer tous les éléments du menu
// Cette fonction renvoie une promesse qui se résout en un tableau d'objets MenuItem
export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    // Création d'une requête pour obtenir les éléments triés par catégorie
    const menuQuery = query(menuCollection, orderBy('category'));
    // Exécution de la requête et récupération des résultats
    const snapshot = await getDocs(menuQuery);
    // Transformation des documents Firestore en objets MenuItem
    return snapshot.docs.map(doc => ({ 
      id: doc.id, // Ajout de l'ID du document
      ...doc.data() // Déstructuration des données du document
    } as MenuItem));
  } catch (error) {
    // Gestion des erreurs
    console.error("Error fetching menu items:", error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

// Fonction pour récupérer un élément du menu par son ID
// Prend l'ID de l'élément en paramètre et renvoie l'élément correspondant ou null s'il n'existe pas
export const getMenuItemById = async (id: string): Promise<MenuItem | null> => {
  try {
    // Référence au document à récupérer
    const menuDocRef = doc(db, 'menu', id);
    // Récupération du document
    const docSnap = await getDoc(menuDocRef);
    
    // Vérification de l'existence du document
    if (docSnap.exists()) {
      // Transformation du document Firestore en objet MenuItem
      return { 
        id: docSnap.id, 
        ...docSnap.data() 
      } as MenuItem;
    } else {
      console.log(`Menu item with ID ${id} not found`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching menu item ${id}:`, error);
    return null; // Retourne null en cas d'erreur
  }
};

// Fonction pour récupérer les éléments du menu par catégorie
// Prend une catégorie en paramètre et renvoie uniquement les éléments de cette catégorie
export const getMenuItemsByCategory = async (category: string): Promise<MenuItem[]> => {
  try {
    // Création d'une requête avec un filtre sur la catégorie
    const menuQuery = query(menuCollection, where('category', '==', category), orderBy('name'));
    // Exécution de la requête et récupération des résultats
    const snapshot = await getDocs(menuQuery);
    // Transformation des documents Firestore en objets MenuItem
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as MenuItem));
  } catch (error) {
    console.error(`Error fetching menu items for category ${category}:`, error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

// Fonction pour ajouter un nouvel élément au menu
// Prend un objet MenuItem sans ID (l'ID sera généré par Firestore)
export const addMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<string | null> => {
  try {
    // Ajout d'un nouveau document à la collection "menu"
    const docRef = await addDoc(menuCollection, item);
    return docRef.id; // Retourne l'ID du document créé
  } catch (error) {
    console.error("Error adding menu item:", error);
    return null; // Retourne null en cas d'erreur
  }
};

// Fonction pour mettre à jour un élément du menu existant
// Prend l'ID de l'élément et les champs à mettre à jour
export const updateMenuItem = async (id: string, item: Partial<MenuItem>): Promise<boolean> => {
  try {
    // Référence au document à mettre à jour
    const menuDocRef = doc(db, 'menu', id);
    // Mise à jour du document
    await updateDoc(menuDocRef, item);
    return true; // Succès
  } catch (error) {
    console.error(`Error updating menu item ${id}:`, error);
    return false; // Échec
  }
};

// Fonction pour supprimer un élément du menu
// Prend l'ID de l'élément à supprimer
export const deleteMenuItem = async (id: string): Promise<boolean> => {
  try {
    // Référence au document à supprimer
    const menuDocRef = doc(db, 'menu', id);
    // Suppression du document
    await deleteDoc(menuDocRef);
    return true; // Succès
  } catch (error) {
    console.error(`Error deleting menu item ${id}:`, error);
    return false; // Échec
  }
};

// Fonction pour supprimer tous les éléments du menu
// Cette fonction est utilisée avant l'initialisation pour éviter les doublons
export const deleteAllMenuItems = async (): Promise<boolean> => {
  try {
    // Récupérer tous les éléments du menu
    const items = await getMenuItems();
    
    // Supprimer chaque élément
    for (const item of items) {
      await deleteMenuItem(item.id);
    }
    
    console.log(`Successfully deleted ${items.length} menu items`);
    return true; // Succès
  } catch (error) {
    console.error("Error deleting all menu items:", error);
    return false; // Échec
  }
};

// Fonction pour ajouter une nouvelle commande
// Prend les informations de la commande et retourne l'ID de la commande créée
export const addOrder = async (orderData: Omit<Order, 'id'>): Promise<string | null> => {
  try {
    // Ajout d'un timestamp serveur pour la date de commande
    const orderWithTimestamp = {
      ...orderData,
      timestamp: serverTimestamp()
    };
    
    // Ajout d'un nouveau document à la collection "orders"
    const docRef = await addDoc(ordersCollection, orderWithTimestamp);
    console.log(`Order added with ID: ${docRef.id}`);
    return docRef.id; // Retourne l'ID du document créé
  } catch (error) {
    console.error("Error adding order:", error);
    return null; // Retourne null en cas d'erreur
  }
};

// Fonction pour récupérer toutes les commandes
// Cette fonction renvoie une promesse qui se résout en un tableau d'objets Order
export const getOrders = async (): Promise<Order[]> => {
  try {
    // Création d'une requête pour obtenir les commandes triées par date (les plus récentes d'abord)
    const ordersQuery = query(ordersCollection, orderBy('timestamp', 'desc'));
    // Exécution de la requête et récupération des résultats
    const snapshot = await getDocs(ordersQuery);
    // Transformation des documents Firestore en objets Order
    return snapshot.docs.map(doc => {
      const data = doc.data();
      // Conversion du timestamp Firestore en Date JavaScript
      const timestamp = data.timestamp ? new Date((data.timestamp as Timestamp).toDate()) : new Date();
      
      return { 
        id: doc.id,
        ...data,
        timestamp
      } as Order;
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

// Fonction pour récupérer les commandes par statut
// Prend un statut en paramètre et renvoie uniquement les commandes avec ce statut
export const getOrdersByStatus = async (status: Order['status']): Promise<Order[]> => {
  try {
    console.log(`Récupération des commandes avec le statut: ${status}`);
    
    // Création d'une requête avec un filtre sur le statut uniquement (sans tri)
    // Cela évite le besoin d'un index composite
    const ordersQuery = query(
      ordersCollection, 
      where('status', '==', status)
      // Suppression du orderBy pour éviter le besoin d'index
    );
    
    console.log('Requête créée:', ordersQuery);
    
    // Exécution de la requête et récupération des résultats
    const snapshot = await getDocs(ordersQuery);
    
    console.log(`Nombre de commandes récupérées: ${snapshot.docs.length}`);
    
    // Transformation des documents Firestore en objets Order
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`Données de la commande ${doc.id}:`, data);
      
      // Conversion du timestamp Firestore en Date JavaScript
      const timestamp = data.timestamp ? new Date((data.timestamp as Timestamp).toDate()) : new Date();
      
      return { 
        id: doc.id,
        ...data,
        timestamp
      } as Order;
    });
    
    // Tri manuel des commandes par date (plus récentes d'abord)
    // Cela remplace le orderBy dans la requête
    orders.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    console.log(`Commandes transformées:`, orders);
    return orders;
  } catch (error) {
    console.error(`Error fetching orders with status ${status}:`, error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

// Fonction pour mettre à jour le statut d'une commande
// Prend l'ID de la commande et le nouveau statut
export const updateOrderStatus = async (id: string, status: Order['status']): Promise<boolean> => {
  try {
    // Référence au document à mettre à jour
    const orderDocRef = doc(db, 'orders', id);
    // Mise à jour du statut de la commande
    await updateDoc(orderDocRef, { status });
    console.log(`Order ${id} status updated to ${status}`);
    return true; // Succès
  } catch (error) {
    console.error(`Error updating order ${id} status:`, error);
    return false; // Échec
  }
};

// Fonction pour supprimer une commande
// Prend l'ID de la commande à supprimer
export const deleteOrder = async (id: string): Promise<boolean> => {
  try {
    // Référence au document à supprimer
    const orderDocRef = doc(db, 'orders', id);
    // Suppression du document
    await deleteDoc(orderDocRef);
    console.log(`Order ${id} deleted successfully`);
    return true; // Succès
  } catch (error) {
    console.error(`Error deleting order ${id}:`, error);
    return false; // Échec
  }
};

// Fonction pour récupérer toutes les commandes (pour les statistiques)
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const ordersSnapshot = await getDocs(ordersCollection);
    return ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};

// Fonction pour obtenir le nombre total de commandes
export const getTotalOrdersCount = async (): Promise<number> => {
  try {
    const orders = await getAllOrders();
    return orders.length;
  } catch (error) {
    console.error('Error getting total orders count:', error);
    return 0;
  }
};

// Fonction pour calculer le revenu total
export const getTotalRevenue = async (): Promise<number> => {
  try {
    const orders = await getAllOrders();
    return orders.reduce((total, order) => total + (order.total || 0), 0);
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    return 0;
  }
};

// Fonction pour obtenir les plats les plus populaires
export const getPopularItems = async (limit: number = 5): Promise<{name: string, count: number}[]> => {
  try {
    const orders = await getAllOrders();
    
    // Créer un dictionnaire pour compter les occurrences de chaque plat
    const itemCounts: Record<string, number> = {};
    
    // Parcourir toutes les commandes et compter les plats
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const itemName = item.name;
          itemCounts[itemName] = (itemCounts[itemName] || 0) + item.quantity;
        });
      }
    });
    
    // Convertir le dictionnaire en tableau et trier par popularité
    const popularItems = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return popularItems;
  } catch (error) {
    console.error('Error getting popular items:', error);
    return [];
  }
};

// Fonction pour obtenir les commandes par jour de la semaine
export const getOrdersByDayOfWeek = async (): Promise<Record<string, number>> => {
  try {
    const orders = await getAllOrders();
    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const ordersByDay: Record<string, number> = {
      'Lundi': 0,
      'Mardi': 0,
      'Mercredi': 0,
      'Jeudi': 0,
      'Vendredi': 0,
      'Samedi': 0,
      'Dimanche': 0
    };
    
    orders.forEach(order => {
      if (order.timestamp) {
        // Vérifier si timestamp est un objet Firestore Timestamp ou une Date JavaScript
        const date = typeof order.timestamp === 'object' && 'toDate' in order.timestamp 
          ? (order.timestamp as { toDate(): Date }).toDate() 
          : new Date(order.timestamp);
        const dayOfWeek = date.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
        const dayName = dayNames[dayOfWeek];
        ordersByDay[dayName] = (ordersByDay[dayName] || 0) + 1;
      }
    });
    
    return ordersByDay;
  } catch (error) {
    console.error('Error getting orders by day of week:', error);
    return {
      'Lundi': 0,
      'Mardi': 0,
      'Mercredi': 0,
      'Jeudi': 0,
      'Vendredi': 0,
      'Samedi': 0,
      'Dimanche': 0
    };
  }
};