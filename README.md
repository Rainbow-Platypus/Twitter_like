# Clone Twitter avec Symfony et React

Ce projet est un clone de Twitter utilisant une stack moderne avec Symfony 6.4 pour le backend et React 18 avec Zustand pour le frontend.

## 🚀 Technologies utilisées

- **Backend** : Symfony 6.4 avec API Platform et JWT Authentication
- **Frontend** : React 18, TypeScript, Zustand, TailwindCSS
- **Base de données** : PostgreSQL 14
- **Cache** : Redis
- **Serveur Web** : Caddy
- **Monitoring** : Prometheus + Grafana
- **Interface d'administration** : Adminer

## 📦 Prérequis

- Docker et Docker Compose
- Git

## 🛠 Installation

1. Cloner le dépôt :
```bash
git clone [URL_DU_REPO]
cd twitter-clone
```

2. Lancer les conteneurs Docker :
```bash
docker-compose up -d
```

3. Installer les dépendances Symfony :
```bash
docker-compose exec php composer install
```

4. Créer la base de données et exécuter les migrations :
```bash
docker-compose exec php bin/console doctrine:database:create
docker-compose exec php bin/console doctrine:migrations:migrate
```

5. Charger les fixtures (données de test) :
```bash
docker-compose exec php bin/console doctrine:fixtures:load
```

## 🌐 Accès aux services

- **Frontend** : http://localhost
- **API Backend** : http://localhost/api
- **Adminer** : http://localhost:8080
- **Prometheus** : http://localhost:9090
- **Grafana** : http://localhost:3000

## 📱 Fonctionnalités principales

- Authentification (inscription/connexion)
- Publication de tweets
- Timeline personnalisée
- Profil utilisateur
- Like/Unlike des tweets
- Persistance des données avec Zustand

## 🔧 Structure du projet

```
.
├── backend/                 # Code Symfony
│   ├── src/
│   ├── config/
│   └── ...
├── frontend/               # Code React
│   ├── src/
│   │   ├── components/
│   │   ├── stores/
│   │   └── ...
│   └── ...
├── caddy/                  # Configuration Caddy
├── prometheus/             # Configuration Prometheus
└── docker-compose.yml
```

## 🛡 Sécurité

- Authentification JWT
- CORS configuré
- Validation des données
- Protection contre les attaques XSS et CSRF

## 📝 Développement

### Backend

Pour créer une nouvelle entité :
```bash
docker-compose exec php bin/console make:entity
```

Pour créer une migration :
```bash
docker-compose exec php bin/console make:migration
docker-compose exec php bin/console doctrine:migrations:migrate
```

### Frontend

Pour ajouter une dépendance :
```bash
docker-compose exec frontend npm install [package-name]
```

## 📊 Monitoring

- Prometheus collecte les métriques de tous les services
- Grafana fournit des tableaux de bord pour visualiser les performances
- Les logs sont centralisés et accessibles via Grafana

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 