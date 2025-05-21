# 💊 PharmaStock

**PharmaStock** est une application web moderne de gestion de stock pour les pharmacies. Elle permet de suivre en temps réel les médicaments disponibles, les mouvements de stock, les seuils d'alerte, et bien plus encore.  
Le projet est divisé en deux parties : un **backend Laravel** et un **frontend React** avec des technologies modernes.

---

## 🚀 Technologies utilisées

### Backend (API)

- **Laravel** (PHP)
- **Sanctum** pour l'authentification via tokens
- **MySQL** pour la base de données
- API RESTful

### Frontend

- **React**
- **TailwindCSS** pour le design responsive
- **Jotai** pour la gestion d'état globale
- **Lucide-react** pour les icônes modernes
- **Chart.js** pour les graphiques (statistiques de stock)
- **Framer Motion** pour les animations fluides

---

## 🔐 Authentification

L'application utilise **Laravel Sanctum** pour sécuriser les requêtes API.  
Lorsqu'un utilisateur se connecte avec succès, l'API renvoie un token d'accès (`Bearer Token`) à utiliser dans les requêtes authentifiées.

---

## 📦 Fonctionnalités principales

- 🔍 Rechercher, créer, modifier et supprimer des **médicaments**
- 📉 Suivi des **mouvements de stock** (ajouts, retraits)
- 🚨 Alerte en cas de dépassement de **seuil critique**
- 📊 Statistiques dynamiques des stocks avec **Chart.js**
- 🔒 Authentification sécurisée avec **Sanctum**
- 🎨 Interface animée et réactive avec **TailwindCSS** et **Framer Motion**

---

## 📁 Structure du projet

pharmastock/
├── backend/  
│ ├── app/
│ ├── routes/
│ ├── database/
│ └── ...
├── frontend/  
│ ├── src/
│ │ ├── components/
│ │ ├── store/
│ │ ├── pages/
│ │ └── ...
│ │  
└── README.md

## 📁 Installation du projet

## Configuration Backend

git clone https://github.com/votre-utilisateur/pharmastock.git
cd pharmastock
cd backend

# Installer les dépendances PHP

composer install

# Générer la clé de l'application

php artisan key:generate

# Configurer votre base de données dans le fichier .env

# Lancer les migrations

php artisan migrate

# Démarrer le serveur

php artisan serve

## Configuration Frontend

# Installer les dépendances Node.js

npm install

# Lancer l'application React

npm run dev
