# 📦 Inventory Management System - Premium Dashboard

Système de gestion d'inventaire full-stack moderne, performant et sécurisé, conçu avec **Laravel** pour le backend et **React** pour le frontend. Il utilise un design "premium" inspiré du mode sombre avec des effets de flou (Glassmorphism).

---

## 🚀 Technologies Utilisées

### 🖥️ Frontend (Client)

- **React.js (Vite)** : Framework principal pour une UI réactive.
- **Zustand** : Gestion d'état globale (Store) légère et performante.
- **Axios** : Appels API avec intercepteurs pour la gestion automatique des tokens JWT.
- **Recharts** : Visualisations de données dynamiques (Area, Bar, Pie Charts).
- **Lucide React** : Collection d'icônes modernes.
- **React Hot Toast** : Système de notifications élégant.
- **CSS3 (Vanilla)** : Design system sur mesure avec variables CSS et animations.

### ⚙️ Backend (Serveur & API)

- **Laravel** : Framework PHP robuste pour l'API REST.
- **Sanctum** : Authentification stateless basée sur les tokens.
- **Spatie Laravel Permission** : Gestion fine des rôles (RBAC) et permissions.
- **SQLite** : Base de données légère et rapide (facile à migrer).

---

## 📊 Architecture de la Base de Données

Le système repose sur une structure relationnelle optimisée :

- **Users** : Gère l'authentification et les rôles (`admin` vs `user`).
- **Categories** : Classification des produits. (_Relation 1:N avec Products_)
- **Suppliers** : Registre des fournisseurs. (_Relation 1:N avec Products_)
- **Products** : Cœur de l'inventaire (Nom, Prix, Quantité, Image).
- **Orders** : Historique des transactions.
  - `user_id` -> Qui a commandé.
  - `product_id` -> Quel produit.
  - `status` -> `pending`, `completed`, `canceled`.
- **InventoryLogs** : Journal d'audit automatique traçant chaque mouvement de stock (Vente, Réapprovisionnement).

---

## 🛠️ Installation & Configuration

### 1. Configuration du Backend

```bash
# Entrer dans le dossier backend
cd backend

# Installer les dépendances PHP
composer install

# Configurer l'environnement (Vérifier DB_CONNECTION=sqlite)
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Créer la base de données SQLite
touch database/database.sqlite

# Lancer les migrations et les seeders (Données de test + Admin)
php artisan migrate --seed
```

### 2. Configuration du Frontend

```bash
# Entrer dans le dossier frontend
cd frontend

# Installer les dépendances JS
npm install

# Lancer le serveur de développement
npm run dev
```

---

## 🔒 Sécurité & Rôles (RBAC)

| Rôle      | Accès & Permissions                                                                                                                          |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| **Admin** | Accès TOTAL : Dashboard complet, gestion des produits, catégories, fournisseurs, utilisateurs et validation des commandes.                   |
| **User**  | Accès Restreint : Dashboard personnel, liste des produits (lecture seule), passer des commandes et annuler ses propres commandes en attente. |

---

## 📡 Endpoints API Principaux

- `POST /api/login` - Authentification
- `GET /api/products` - Liste des produits (Filtrable)
- `POST /api/orders` - Création de commande (Déclenche le cycle de vie du stock)
- `PUT /api/orders/{id}` - Mise à jour du statut (Admin uniquement pour validation)
- `GET /api/stats` - Données pour les graphiques du Dashboard

---

## 💡 Commandes Utiles (Laravel)

- **Créer un Controller** : `php artisan make:controller Api/NomController --api`
- **Créer un Modèle + Migration** : `php artisan make:model Nom -m`
- **Rafraîchir la DB** : `php artisan migrate:fresh --seed`
- **Créer un Seeder** : `php artisan make:seeder NomSeeder`

---

## 🎨 Design System

Le projet utilise un système de variables CSS (`:root`) défini dans `index.css` permettant de modifier les couleurs primaires, les arrondis (`border-radius`) et les flous de background en un seul endroit.

---

_Développé avec ❤️ par Antigravity._
