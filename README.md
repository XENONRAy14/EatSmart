# EatSmart - Application de Gestion de Restaurant

EatSmart est une application web moderne et simplifiée pour la gestion complète d'un restaurant, développée avec React, TypeScript, Tailwind CSS avec DaisyUI et Firebase. Elle offre une interface utilisateur intuitive et élégante permettant aux clients de consulter le menu et de passer des commandes, et au personnel du restaurant de gérer efficacement les commandes et le menu.

## 🚀 Guide de démarrage rapide

Pour lancer le projet en local, suivez ces étapes simples :

### Prérequis
- Node.js installé sur votre machine (version 16 ou supérieure recommandée)
- npm (gestionnaire de paquets Node.js)

### Étapes de lancement
1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/XENONRAy14/EatSmart.git
   cd EatSmart
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

4. **Accéder à l'application** : Ouvrez votre navigateur et allez à l'adresse http://localhost:5173

### Initialisation des données (première utilisation)
1. Accédez à la page Admin via http://localhost:5173/admin
2. Connectez-vous avec les identifiants par défaut :
   - Email : admin@eatsmart.com
   - Mot de passe : admin123
3. Dans le tableau de bord administrateur, utilisez l'option "Initialiser les données" pour charger les données initiales du menu

### Navigation dans l'application
- **Accueil** : http://localhost:5173/ - Page d'accueil avec présentation du restaurant
- **Menu** : http://localhost:5173/menu - Consultation du menu par catégories
- **Détail d'un plat** : http://localhost:5173/menu/:id - Information détaillée sur un plat
- **Commander** : http://localhost:5173/order - Passer une commande
- **Cuisine** : http://localhost:5173/kitchen - Interface pour le personnel de cuisine
- **Admin** : http://localhost:5173/admin - Tableau de bord administrateur (accès protégé)
- **Connexion** : http://localhost:5173/login - Page d'authentification

## 📋 Fonctionnalités Principales

### Pour les Clients
- **Interface Utilisateur Moderne** : Design épuré et responsive avec DaisyUI et Tailwind CSS
- **Consultation du Menu par Catégories** : Navigation intuitive entre les catégories (entrées, plats, desserts, boissons)
- **Détails des Plats** : Affichage détaillé avec description, prix et image pour chaque plat
- **Panier d'Achat Interactif** : Ajout, suppression et modification des quantités en temps réel
- **Formulaire de Commande Simplifié** : Saisie facile des informations client
- **Notifications Toast** : Confirmations et alertes avec React Hot Toast
- **Carte Interactive** : Localisation du restaurant avec Leaflet

### Pour le Personnel de Cuisine
- **Tableau de Bord Simplifié** : Vue d'ensemble claire des commandes en cours
- **Filtrage des Commandes** : Tri par statut (en attente, en préparation, prêtes)
- **Mise à Jour Rapide** : Changement de statut des commandes en un clic
- **Interface Intuitive** : Composants DaisyUI pour une meilleure expérience utilisateur
- **Mode Test** : Possibilité de créer des commandes de test pour la démonstration

### Pour les Administrateurs
- **Authentification Sécurisée** : Système de connexion basé sur Firebase Authentication
- **Tableau de Bord Analytique** : Visualisation des statistiques clés avec des composants DaisyUI
- **Graphiques Interactifs** : 
  - Répartition des commandes par jour avec Recharts
  - Visualisation des plats populaires
  - Analyse des revenus
- **Gestion Simplifiée du Menu** : Interface intuitive pour ajouter, modifier ou supprimer des plats
- **Gestion des Données** : Initialisation et réinitialisation facile des données

## 🛠️ Structure du Projet

```
EatSmart/
├── src/                      # Code source principal
│   ├── components/           # Composants réutilisables
│   │   ├── Dashboard.tsx     # Tableau de bord avec statistiques et graphiques
│   │   ├── Map.tsx           # Composant de carte pour afficher l'emplacement
│   │   ├── Navbar.tsx        # Barre de navigation responsive avec DaisyUI
│   │   └── ProtectedRoute.tsx # Composant pour protéger les routes admin
│   ├── pages/                # Pages principales de l'application
│   │   ├── Admin.tsx         # Page d'administration avec tableau de bord
│   │   ├── Home.tsx          # Page d'accueil avec présentation du restaurant
│   │   ├── Kitchen.jsx       # Interface de gestion des commandes pour la cuisine
│   │   ├── Login.tsx         # Page de connexion pour les administrateurs
│   │   ├── Menu.tsx          # Affichage du menu par catégories
│   │   ├── MenuItemDetail.tsx # Page de détail d'un plat spécifique
│   │   └── Order.tsx         # Page de commande avec panier interactif
│   ├── App.tsx               # Configuration des routes et structure générale
│   ├── firebase.ts           # Configuration et fonctions d'accès à Firebase
│   ├── index.css             # Styles CSS globaux et configuration Tailwind
│   ├── initializeData.ts     # Données initiales pour le menu
│   ├── main.tsx              # Point d'entrée de l'application
│   ├── types.ts              # Définitions de types TypeScript pour l'application
│   └── vite-env.d.ts         # Déclarations de types pour Vite
├── .firebase/                # Configuration de déploiement Firebase
├── index.html                # Page HTML principale
├── package.json              # Dépendances et scripts npm
├── tailwind.config.js        # Configuration de Tailwind CSS avec DaisyUI
├── vite.config.ts            # Configuration de Vite
├── tsconfig.json             # Configuration TypeScript
├── postcss.config.js         # Configuration PostCSS pour Tailwind
└── firebase.json             # Configuration de déploiement Firebase
```

## 🔧 Technologies Utilisées

- **Frontend** :
  - React 18 avec Hooks pour la gestion de l'état
  - TypeScript pour un typage statique et une meilleure maintenabilité
  - Tailwind CSS 3.4 pour le styling modulaire et responsive
  - DaisyUI 5.0 pour des composants UI modernes et cohérents
  - React Router 6 pour une navigation fluide entre les pages
  - Lucide React pour des icônes vectorielles légères
  - Recharts pour des visualisations de données interactives
  - React Hot Toast pour des notifications élégantes et non intrusives

- **Backend et Infrastructure** :
  - Firebase Firestore pour une base de données NoSQL en temps réel
  - Firebase Authentication pour une gestion sécurisée des utilisateurs
  - Firebase Hosting pour un déploiement rapide et fiable
  - Vite comme outil de build pour des performances optimales

- **Cartographie et Géolocalisation** :
  - Leaflet avec React Leaflet pour l'intégration de cartes interactives
  - OpenStreetMap comme fournisseur de données cartographiques

## 🔐 Sécurité et Performance

- **Authentification Robuste** : Implémentation complète de Firebase Authentication
- **Composant ProtectedRoute** : Contrôle d'accès granulaire aux sections administratives
- **Validation des Données** : Vérification côté client et serveur pour prévenir les injections
- **Optimisation des Performances** :
  - Chargement asynchrone des données
  - Utilisation de useEffect et useState pour une gestion efficace de l'état
  - Composants optimisés pour éviter les rendus inutiles
- **Gestion des Erreurs** : Capture et affichage des erreurs pour une meilleure expérience utilisateur

## 🚀 Fonctionnalités Détaillées

### Système de Commande Optimisé
- **Interface Utilisateur Simplifiée** : Processus de commande en quelques clics
- **Gestion du Panier en Temps Réel** : Ajout, suppression et modification des quantités instantanés
- **Calcul Automatique du Total** : Mise à jour dynamique du montant total
- **Formulaire Client Intuitif** : Champs optimisés pour une saisie rapide
- **Notifications Contextuelles** : Alertes et confirmations avec React Hot Toast
- **Validation des Données** : Vérification des informations avant soumission

### Menu Interactif avec DaisyUI
- **Navigation par Onglets** : Sélection facile des catégories de plats
- **Cartes de Plats Modernes** : Présentation élégante avec composants DaisyUI
- **Détails Enrichis** : Page dédiée pour chaque plat avec informations complètes
- **Indicateurs Visuels** : Badges pour les plats populaires ou épuisés
- **Recherche et Filtrage** : Options pour trouver rapidement des plats spécifiques

### Interface de Cuisine Repensée
- **Tableau de Bord Minimaliste** : Affichage clair des commandes sans surcharge visuelle
- **Système de Filtres** : Organisation des commandes par statut avec un code couleur intuitif
- **Actions Rapides** : Boutons d'action directe pour changer le statut des commandes
- **Mode Démonstration** : Génération de commandes de test pour la formation
- **Notifications Sonores** : Alertes pour les nouvelles commandes

## 📍 Localisation et Informations Pratiques

L'application intègre une carte interactive Leaflet montrant l'emplacement du restaurant :

- **Adresse** : 16 Boulevard Jeanne d'Arc, 13005 Marseille
- **Téléphone** : 06 51 36 31 92
- **Email** : contact@eatsmart-restaurant.com
- **Horaires** :
  - Du Mardi au Vendredi : 12h-14h30 / 19h-22h30
  - Samedi et Dimanche : 12h-15h / 19h-23h
  - Lundi : Fermé
- **Accès** : Parking à proximité, accès PMR
- **Réservation** : Directement depuis l'application ou par téléphone

## 🔜 Développements Futurs Envisagés

- **Système de Réservation en Ligne** : Réservation de tables avec sélection d'horaires et confirmation automatique
- **Programme de Fidélité** : Système de points et récompenses pour les clients réguliers
- **Paiement Intégré** : Intégration de solutions de paiement en ligne (Stripe, PayPal)
- **Application Mobile** : Version native avec React Native pour iOS et Android
- **Mode Sombre** : Thème sombre complet utilisant les capacités de thématisation de DaisyUI
- **Tableau de Bord Avancé** : Analyses et statistiques détaillées pour les administrateurs
- **Gestion des Stocks** : Suivi en temps réel des ingrédients et alertes de réapprovisionnement
- **Multilinguisme** : Support de plusieurs langues pour une clientèle internationale
- **Intégration de Services de Livraison** : Connexion avec des API de livraison externes

## 🛠️ Améliorations Récentes

- **Refonte UI/UX** : Adoption de DaisyUI pour une interface utilisateur moderne et cohérente
- **Simplification du Code** : Réécriture des composants pour une meilleure lisibilité et maintenabilité
- **Optimisation des Performances** : Réduction des temps de chargement et amélioration de la réactivité
- **Amélioration de la Navigation** : Structure de routage simplifiée et plus intuitive
- **Gestion d'Erreurs Améliorée** : Meilleure capture et affichage des erreurs pour une expérience utilisateur fluide
- **Responsive Design** : Adaptation complète à tous les formats d'écran (mobile, tablette, desktop)
- **Accessibilité** : Amélioration de la compatibilité avec les technologies d'assistance

---

Développé par [XENONRAy14](https://github.com/XENONRAy14)
Dernière mise à jour : Mai 2025
