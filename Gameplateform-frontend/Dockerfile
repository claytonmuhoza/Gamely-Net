# Étape de build
FROM node:20-alpine AS build
WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Build de l'application
COPY . .
# On définit l'URL du backend via une variable d'environnement de build
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Serveur Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Configuration pour React Router
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]