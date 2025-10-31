# 🎮 Gamely

**Plateforme de jeux multijoueurs en ligne** développée dans le cadre du **TP .NET 2025/2026**.

Ce dépôt contient la base du projet **Gamely**, une application web collaborative permettant de jouer à plusieurs jeux en ligne via des lobbys temps réel.  
Le README sera complété ultérieurement avec les choix techniques finaux, les consignes de déploiement et les détails d’implémentation.

---

## 🧩 Stack Technique (prévisionnelle)

### 🖥️ Backend
- **Framework** : ASP.NET Core **9** Web API  
- **Communication temps réel** : SignalR  
- **Base de données** : SQL Server *(ou PostgreSQL)*  
- **ORM** : Entity Framework Core 9  

### 💻 Frontend
- **Framework** : React + Vite  
- **Communication SignalR** : @microsoft/signalr  
- **Styling** : Tailwind CSS *(responsive et rapide à mettre en place)*  
- **State Management** : React Context API  

---

## 🏗️ Structure Technique (en cours de mise en place)

```

GamePlatform/
├── Backend/
│   ├── GamePlatform.API/      # API REST + SignalR Hubs
│   ├── GamePlatform.Core/     # Logique métier (services, modèles)
│   └── GamePlatform.Data/     # Accès aux données (EF Core)
└── Frontend/
├── src/                   # Code source React
└── package.json

```

---

## 🚧 État actuel du projet
- [ ] Initialisation du dépôt  
- [ ] Mise en place du backend (.NET 9)  
- [ ] Configuration du frontend (React + Vite)  
- [ ] Ajout des Hubs SignalR  
- [ ] Intégration de la base de données  

---

## 📅 À venir
- Documentation technique détaillée  
- Diagrammes d’architecture  
- Instructions de lancement et de déploiement  
- Répartition des fonctionnalités par membre d’équipe  

---

## 📄 Licence
Projet académique – **Université de Rouen**, année 2025/2026.  
Tous droits réservés au groupe **Gamely**.

---

👾 *README initial – à compléter au fur et à mesure de l’avancement du projet.*
