<div align="center">
  <img src="./frontend//src/assets/Logo.png" alt="InvenTrack Logo" width="200" />
  <h1>📦 InvenTrack - Système de Gestion d'Inventaire Premium</h1>
  <p>Une solution full-stack complète pour la gestion de stocks, commandes et analytiques.</p>
</div>

---

## 🚀 Présentation

**InvenTrack** est une application moderne conçue pour simplifier la gestion des stocks. Elle offre une interface élégante en mode sombre (Glassmorphism) et une architecture robuste basée sur Laravel et React.

---

## 📊 Diagramme de Classe (Architecture des Données)

```mermaid
classDiagram
    class User {
        +int id
        +string name
        +string email
        +string role
    }
    class Category {
        +int id
        +string name
        +string description
    }
    class Supplier {
        +int id
        +string name
        +string email
        +string phone
        +string address
    }
    class Product {
        +int id
        +string name
        +float price
        +int quantity
        +string image
        +int category_id
        +int supplier_id
    }
    class Order {
        +int id
        +int user_id
        +int product_id
        +int quantity
        +float total_price
        +string status
        +datetime created_at
    }
    class InventoryLog {
        +int id
        +int product_id
        +string change_type
        +int quantity
        +string description
        +datetime created_at
    }

    User "1" -- "*" Order : passe
    Category "1" -- "*" Product : classifie
    Supplier "1" -- "*" Product : fournit
    Product "1" -- "*" Order : est commandé
    Product "1" -- "*" InventoryLog : est tracé
```

---

## 📡 Routes & Fonctionnalités

### 🖥️ Frontend (React)

| Route         | Description                                 | Accès             |
| :------------ | :------------------------------------------ | :---------------- |
| `/`           | Tableau de bord (Statistiques & Graphiques) | Tous              |
| `/login`      | Connexion à l'application                   | Public            |
| `/register`   | Création de compte                          | Public            |
| `/products`   | Liste et recherche de produits              | Tous (CRUD Admin) |
| `/categories` | Gestion des catégories                      | Admin uniquement  |
| `/suppliers`  | Gestion des fournisseurs                    | Admin uniquement  |
| `/orders`     | Historique et passage de commandes          | Tous              |
| `/logs`       | Journal d'audit des stocks                  | Tous              |
| `/users`      | Gestion des utilisateurs                    | Admin uniquement  |

### ⚙️ Backend (API Laravel)

**Authentification (Sanctum)**

- `POST /api/login` : Connexion
- `POST /api/register` : Inscription
- `POST /api/logout` : Déconnexion
- `GET /api/me` : Infos utilisateur connecté

**Gestion des Ressources**

- `apiResource('products')` : CRUD complet produits (Image upload supporté)
- `apiResource('categories')` : CRUD catégories (Admin)
- `apiResource('suppliers')` : CRUD fournisseurs (Admin)
- `apiResource('orders')` : Index, Store et Update (Validation de commande)
- `GET /api/inventory-logs` : Liste des mouvements de stock
- `GET /api/users` : Liste des membres (Admin)

---

## 🛠️ Installation

### Backend (Laravel)

1. `composer install`
2. `php artisan migrate --seed`
3. `php artisan serve`

### Frontend (React)

1. `npm install`
2. `npm run dev`

---

_Ce projet est maintenu sous licence MIT._
