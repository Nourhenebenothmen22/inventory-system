# Inventory System - Backend API

API REST sécurisée pour un système de gestion d'inventaire avec authentification, RBAC, et gestion d'images.

## 🚀 Technologies

-   **Laravel 12** - Framework PHP
-   **Laravel Sanctum** - Authentification API par jetons
-   **Spatie Laravel Permission** - Gestion des rôles et permissions (RBAC)
-   **SQLite** - Base de données (configurable pour MySQL/PostgreSQL)

## 📋 Prérequis

-   PHP 8.2+
-   Composer
-   SQLite (ou MySQL/PostgreSQL)

## ⚙️ Installation

### 1. Installer les dépendances

```bash
composer install
```

### 2. Configuration de l'environnement

```bash
cp .env.example .env
php artisan key:generate
```

### 3. Migrations et Seeders

```bash
php artisan migrate
php artisan db:seed --class=RolePermissionSeeder
```

### 4. Lien symbolique pour les images

```bash
php artisan storage:link
```

### 5. Lancer le serveur

```bash
php artisan serve
```

L'API sera accessible sur : `http://localhost:8000/api`

## 🔐 Authentification

### Inscription

```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Réponse :**

```json
{
    "access_token": "1|xxxxxxxxxxxxx",
    "token_type": "Bearer",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "roles": [{ "name": "user" }]
    }
}
```

### Connexion

```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Utilisation du Token

Pour toutes les routes protégées, ajoutez le header :

```
Authorization: Bearer <votre_token>
```

## 📚 Endpoints API

### Authentification (Public)

| Méthode | Endpoint        | Description |
| ------- | --------------- | ----------- |
| POST    | `/api/register` | Inscription |
| POST    | `/api/login`    | Connexion   |

### Profil (Protégé)

| Méthode | Endpoint      | Description        |
| ------- | ------------- | ------------------ |
| GET     | `/api/me`     | Profil utilisateur |
| POST    | `/api/logout` | Déconnexion        |

### Catégories (Protégé)

| Méthode   | Endpoint               | Description |
| --------- | ---------------------- | ----------- |
| GET       | `/api/categories`      | Liste       |
| POST      | `/api/categories`      | Créer       |
| GET       | `/api/categories/{id}` | Détail      |
| PUT/PATCH | `/api/categories/{id}` | Modifier    |
| DELETE    | `/api/categories/{id}` | Supprimer   |

### Produits (Protégé) 🖼️

| Méthode   | Endpoint             | Description                           |
| --------- | -------------------- | ------------------------------------- |
| GET       | `/api/products`      | Liste avec catégories et fournisseurs |
| POST      | `/api/products`      | Créer (avec image)                    |
| GET       | `/api/products/{id}` | Détail                                |
| PUT/PATCH | `/api/products/{id}` | Modifier                              |
| DELETE    | `/api/products/{id}` | Supprimer                             |

**Exemple de création avec image (form-data) :**

```
name: Chaise Gamer
category_id: 1
supplier_id: 1
price: 150.00
quantity: 10
image: [fichier]
```

### Fournisseurs (Protégé) 🖼️

| Méthode   | Endpoint              | Description        |
| --------- | --------------------- | ------------------ |
| GET       | `/api/suppliers`      | Liste              |
| POST      | `/api/suppliers`      | Créer (avec image) |
| GET       | `/api/suppliers/{id}` | Détail             |
| PUT/PATCH | `/api/suppliers/{id}` | Modifier           |
| DELETE    | `/api/suppliers/{id}` | Supprimer          |

### Commandes (Protégé)

| Méthode   | Endpoint           | Description                             |
| --------- | ------------------ | --------------------------------------- |
| GET       | `/api/orders`      | Liste                                   |
| POST      | `/api/orders`      | Créer (déduit le stock automatiquement) |
| GET       | `/api/orders/{id}` | Détail                                  |
| PUT/PATCH | `/api/orders/{id}` | Modifier le statut                      |

**Exemple de création :**

```json
{
    "product_id": 1,
    "quantity": 2
}
```

### Logs d'inventaire (Protégé)

| Méthode | Endpoint              | Description                        |
| ------- | --------------------- | ---------------------------------- |
| GET     | `/api/inventory-logs` | Historique des mouvements de stock |

## 🎭 Rôles et Permissions

### Rôles disponibles

-   **admin** : Accès complet (manage inventory, view orders, manage users)
-   **user** : Accès limité (view orders)

### Assigner un rôle

```php
use App\Models\User;

$user = User::find(1);
$user->assignRole('admin');
```

## 📁 Structure des Images

Les images sont stockées dans :

-   **Physiquement** : `storage/app/public/products` et `storage/app/public/suppliers`
-   **Accessibles via** : `http://localhost:8000/storage/products/xyz.png`

Les modèles `Product` et `Supplier` retournent automatiquement l'URL complète grâce aux Accessors.

## 🗄️ Schéma de Base de Données

```
users
├── id
├── name
├── email
├── password
└── timestamps

categories
├── id
├── name
├── description
└── timestamps

suppliers
├── id
├── name
├── email
├── phone
├── image
└── timestamps

products
├── id
├── name
├── category_id (FK)
├── supplier_id (FK, nullable)
├── price
├── quantity
├── image
└── timestamps

orders
├── id
├── user_id (FK)
├── product_id (FK, onDelete: restrict)
├── unit_price (snapshot)
├── quantity
├── total_price
├── status (pending, completed, canceled)
└── timestamps

inventory_logs
├── id
├── product_id (FK)
├── quantity_changed
├── type (enum: sale, restock, adjustment)
└── timestamps
```

## 🧪 Tests avec Postman

1. **Inscription/Connexion** → Récupérer le token
2. **Créer une catégorie** → Récupérer l'ID
3. **Créer un produit avec image** → Utiliser `form-data`
4. **Passer une commande** → Le stock sera automatiquement déduit
5. **Consulter les logs** → Vérifier l'historique

## 🔧 Commandes Utiles

```bash
# Lister toutes les routes
php artisan route:list --path=api

# Vider le cache
php artisan cache:clear
php artisan config:clear

# Réinitialiser la base de données
php artisan migrate:fresh --seed

# Créer un nouvel utilisateur admin via Tinker
php artisan tinker
>>> $user = User::create(['name' => 'Admin', 'email' => 'admin@test.com', 'password' => Hash::make('password')]);
>>> $user->assignRole('admin');
```

## 📝 Notes Importantes

-   Les images sont **automatiquement supprimées** lors de la suppression d'un produit/fournisseur
-   Les commandes créent automatiquement un **log d'inventaire**
-   Le prix du produit est **figé** dans la commande (colonne `unit_price`)
-   Un produit ne peut pas être supprimé s'il est référencé dans une commande (`onDelete: restrict`)

## 🤝 Contribution

Pour toute question ou amélioration, n'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT
