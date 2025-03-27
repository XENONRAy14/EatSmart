// Importation des fonctions nécessaires de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, Timestamp, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// Import du type MenuItem défini dans types.ts
import { MenuItem, Order } from './types';

// Configuration de Firebase avec les clés d'API et identifiants de votre projet
// Ces informations sont générées lorsque vous créez un projet dans la console Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDhS27Yv1nlmUn1Tf_0QAzi9Aw0HV8K0x0",
  authDomain: "eatsmart-8db59.firebaseapp.com",
  projectId: "eatsmart-8db59",
  storageBucket: "eatsmart-8db59.firebasestorage.app",
  messagingSenderId: "397808866164",
  appId: "1:397808866164:web:40b0a8c156bc2af56e9221"
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