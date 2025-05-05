import axios from 'axios';

// Configuration de base
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

// Intercepteur pour les requêtes
axios.interceptors.request.use(
    (config) => {
        // Vous pouvez ajouter ici des headers d'authentification si nécessaire
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour les réponses
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response) {
            // Gérer les erreurs d'authentification
            if (error.response.status === 401) {
                // Rediriger vers la page de connexion
                window.location.href = '/login';
            }
            
            // Retourner le message d'erreur du serveur s'il existe
            if (error.response.data && error.response.data.message) {
                return Promise.reject(new Error(error.response.data.message));
            }
        }
        return Promise.reject(error);
    }
); 