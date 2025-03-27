# EatSmart - Application de Gestion de Restaurant

EatSmart est une application web moderne pour la gestion complète d'un restaurant, développée avec React, TypeScript, Tailwind CSS et Firebase. Elle permet aux clients de consulter le menu et de passer des commandes, et au personnel du restaurant de gérer les commandes et le menu.

## 📋 Fonctionnalités Principales

### Pour les Clients
- **Consultation du Menu** : Parcourir les différentes catégories de plats (entrées, plats, desserts, boissons)
- **Commande en Ligne** : Ajouter des plats au panier et passer commande
- **Informations sur le Restaurant** : Voir l'adresse, les horaires et les coordonnées du restaurant

### Pour le Personnel de Cuisine
- **Tableau de Bord de Cuisine** : Visualiser toutes les commandes en temps réel
- **Gestion des Commandes** : 
  - Voir les commandes par statut (en attente, en préparation, prêtes)
  - Mettre à jour le statut des commandes
  - Annuler des commandes

### Pour les Administrateurs
- **Gestion du Menu** : Ajouter, modifier ou supprimer des plats
- **Réinitialisation des Données** : Option pour réinitialiser le menu avec des données par défaut

## 🏗️ Structure du Projet

```
project/
├── src/                    # Code source principal
│   ├── components/         # Composants réutilisables
│   │   ├── Map.tsx         # Composant de carte pour afficher l'emplacement
│   │   └── Navbar.tsx      # Barre de navigation
│   ├── pages/              # Pages principales de l'application
│   │   ├── Admin.tsx       # Page d'administration
│   │   ├── Home.tsx        # Page d'accueil
│   │   ├── Kitchen.tsx     # Tableau de bord de cuisine
│   │   ├── Menu.tsx        # Page du menu
│   │   └── Order.tsx       # Page de commande
│   ├── App.tsx             # Composant principal et routage
│   ├── firebase.ts         # Configuration et fonctions Firebase
│   ├── initializeData.ts   # Données initiales pour le menu
│   ├── main.tsx            # Point d'entrée de l'application
│   └── types.ts            # Définitions de types TypeScript
├── public/                 # Fichiers statiques
├── index.html              # Page HTML principale
├── package.json            # Dépendances et scripts
└── tailwind.config.js      # Configuration de Tailwind CSS
```

## 🔧 Technologies Utilisées

- **Frontend** :
  - React
  - TypeScript
  - Tailwind CSS
  - React Router pour la navigation
  - Lucide React pour les icônes

- **Backend** :
  - Firebase Firestore pour la base de données
  - Firebase Functions pour les opérations CRUD

- **Cartographie** :
  - Leaflet pour l'affichage de la carte interactive

## 🚀 Fonctionnalités Détaillées

### Gestion des Commandes
- Création de commandes avec informations client
- Suivi du statut des commandes en temps réel
- Notification pour les nouvelles commandes
- Possibilité d'annuler les commandes

### Menu Interactif
- Affichage des plats par catégorie
- Informations détaillées sur chaque plat (description, prix, image)
- Indication de disponibilité des plats

### Tableau de Bord de Cuisine
- Vue d'ensemble des commandes par statut
- Interface intuitive pour la mise à jour des statuts
- Création de commandes test pour la démonstration

## 📍 Localisation du Restaurant

L'application affiche l'emplacement du restaurant sur une carte interactive :
- Adresse : 16 Bd Jeanne d'Arc, 13005 Marseille
- Téléphone : 06 51 36 31 92
- Horaires : Ouvert du Mardi au Dimanche, 12h-14h30 / 19h-22h30

## 🔜 Développements Futurs Possibles

- Système de réservation de tables
- Programme de fidélité
- Gestion des employés
- Analyse des ventes et statistiques
- Personnalisation de l'interface

---

Développé par [XENONRAy14](https://github.com/XENONRAy14)
