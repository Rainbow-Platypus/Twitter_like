FROM node:20-alpine

WORKDIR /app

# Installation des dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copie du code source
COPY . .

# Exposition du port pour Vite
EXPOSE 5173

# Commande de développement avec hot-reload
CMD ["npm", "run", "dev", "--", "--host"] 