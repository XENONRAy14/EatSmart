import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  CollectionReference,
  DocumentData,
  WithFieldValue,
} from 'firebase/firestore';

import { 
  getAuth, signInWithEmailAndPassword, signOut, 
  onAuthStateChanged, User 
} from 'firebase/auth';
import { MenuItem, Order } from './types';

// Configuration Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Collections Firebase avec types
const menuCollection = collection(db, 'menu') as CollectionReference<MenuItem>;
const ordersCollection = collection(db, 'orders') as CollectionReference<Order>;

// Fonctions génériques CRUD
async function getAll<T>(
  col: CollectionReference<T>,
  orderByField?: string
): Promise<T[]> {
  try {
    const q = orderByField 
      ? query(col, orderBy(orderByField)) 
      : query(col);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as T[];
  } catch (error) {
    console.error('Error getting documents:', error);
    return [];
  }
}

async function getById<T>(
  col: CollectionReference<T>,
  id: string
): Promise<T | null> {
  try {
    const docRef = doc(col, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { ...docSnap.data(), id: docSnap.id } as T;
  } catch (error) {
    console.error(`Error getting document ${id}:`, error);
    return null;
  }
}

async function add<T extends DocumentData>(
  col: CollectionReference<T>,
  data: WithFieldValue<Omit<T, 'id'>>
): Promise<string | null> {
  try {
    const docRef = await addDoc(col, data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    return null;
  }
}

async function update<T extends DocumentData>(
  col: CollectionReference<T>,
  id: string,
  data: WithFieldValue<Partial<T>>
): Promise<boolean> {
  try {
    // @ts-ignore - Ignorer l'erreur de type Firebase
    await updateDoc(doc(col, id), data);
    return true;
  } catch (error) {
    console.error(`Error updating document ${id}:`, error);
    return false;
  }
}

async function remove<T extends DocumentData>(
  col: CollectionReference<T>,
  id: string
): Promise<boolean> {
  try {
    await deleteDoc(doc(col, id));
    return true;
  } catch (error) {
    console.error(`Error deleting document ${id}:`, error);
    return false;
  }
}

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
// Dans une application réelle, on pourrait vérifier un rôle spécifique dans une collection "users"
export const isUserAdmin = (user: User | null): boolean => {
  // Pour l'instant, on considère que tout utilisateur connecté est un administrateur
  // On pourrait améliorer cela en vérifiant une liste d'emails autorisés ou une collection "admins"
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

// Fonctions du menu simplifiées utilisant les fonctions génériques
export const getMenuItems = async (): Promise<MenuItem[]> => {
  return getAll<MenuItem>(menuCollection, 'category');
};

export const getMenuItemById = async (id: string): Promise<MenuItem | null> => {
  return getById<MenuItem>(menuCollection, id);
};

export const getMenuItemsByCategory = async (category: string): Promise<MenuItem[]> => {
  try {
    const q = query(menuCollection, where('category', '==', category), orderBy('name'));
    const snapshot = await getDocs(q);
    const menuItems = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as MenuItem[];
    return menuItems;
  } catch (error) {
    console.error(`Error fetching menu items for category ${category}:`, error);
    return [];
  }
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<string | null> => {
  return add<MenuItem>(menuCollection, item);
};

export const updateMenuItem = async (id: string, item: Partial<MenuItem>): Promise<boolean> => {
  return update<MenuItem>(menuCollection, id, item);
};

export const deleteMenuItem = async (id: string): Promise<boolean> => {
  return remove(menuCollection, id);
};

export const deleteAllMenuItems = async (): Promise<boolean> => {
  try {
    const items = await getMenuItems();
    if (items.length === 0) return true;

    const promises = items.map(item => deleteMenuItem(item.id));
    await Promise.all(promises);
    console.log(`${items.length} éléments du menu supprimés avec succès`);
    return true;
  } catch (error) {
    console.error("Error deleting all menu items:", error);
    return false;
  }
};

// Fonctions de commande simplifiées
export const addOrder = async (orderData: Omit<Order, 'id' | 'timestamp'>): Promise<string | null> => {
  const orderWithTimestamp: WithFieldValue<Omit<Order, 'id'>> = {
    ...orderData,
    timestamp: serverTimestamp()
  };
  return add<Order>(ordersCollection, orderWithTimestamp);
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const orders = await getAll<Order>(ordersCollection, 'timestamp');
    return orders.map(order => ({
      ...order,
      timestamp: order.timestamp instanceof Timestamp 
        ? new Date(order.timestamp.toDate()) 
        : new Date(order.timestamp)
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const getOrdersByStatus = async (status: Order['status']): Promise<Order[]> => {
  try {
    const q = query(ordersCollection, where('status', '==', status));
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        timestamp: data.timestamp instanceof Timestamp 
          ? data.timestamp.toDate()
          : data.timestamp instanceof Date 
            ? data.timestamp
            : new Date(data.timestamp)
      };
    }) as Order[];
    
    return orders.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } catch (error) {
    console.error(`Error fetching orders with status ${status}:`, error);
    return [];
  }
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<boolean> => {
  return update<Order>(ordersCollection, id, { status });
};

export const deleteOrder = async (id: string): Promise<boolean> => {
  return remove(ordersCollection, id);
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const orders = await getAll<Order>(ordersCollection);
    return orders.map(order => ({
      ...order,
      timestamp: order.timestamp instanceof Timestamp 
        ? order.timestamp.toDate() 
        : order.timestamp instanceof Date
          ? order.timestamp
          : new Date(order.timestamp)
    }));
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }
};

export const getTotalOrdersCount = async (): Promise<number> => {
  const orders = await getAllOrders();
  return orders.length;
};

export const getTotalRevenue = async (): Promise<number> => {
  const orders = await getAllOrders();
  return orders.reduce((total, order) => total + (order.total || 0), 0);
};

export const getPopularItems = async (limit: number = 5): Promise<{name: string, count: number}[]> => {
  try {
    const orders = await getAllOrders();
    const itemCounts: Record<string, number> = {};
    
    orders.forEach(order => {
      if (order.items?.length) {
        order.items.forEach(item => {
          itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
      }
    });
    
    return Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting popular items:', error);
    return [];
  }
};

const DAYS_OF_WEEK = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'] as const;
type DayOfWeek = typeof DAYS_OF_WEEK[number];

export const getOrdersByDayOfWeek = async (): Promise<Record<DayOfWeek, number>> => {
  try {
    const orders = await getAllOrders();
    const ordersByDay: Record<DayOfWeek, number> = Object.fromEntries(
      DAYS_OF_WEEK.map((day: DayOfWeek) => [day, 0])
    ) as Record<DayOfWeek, number>;
    
    orders.forEach(order => {
      if (order.timestamp) {
        // À ce stade, timestamp devrait toujours être une Date grâce à getAllOrders
        const date = order.timestamp;
        const dayName = DAYS_OF_WEEK[date.getDay()];
        ordersByDay[dayName]++;
      }
    });
    
    return ordersByDay;
  } catch (error) {
    console.error('Error getting orders by day of week:', error);
    return Object.fromEntries(DAYS_OF_WEEK.map((day: DayOfWeek) => [day, 0])) as Record<DayOfWeek, number>;
  }
};