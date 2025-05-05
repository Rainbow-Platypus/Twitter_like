import create from 'zustand';
import { User, authService } from '../services/authService';

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    login: async (email: string, password: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await authService.login(email, password);
            set({ 
                user: response.user,
                isAuthenticated: true,
                isLoading: false 
            });
        } catch (err) {
            set({ 
                error: err instanceof Error ? err.message : 'Erreur lors de la connexion',
                isLoading: false 
            });
            throw err;
        }
    },

    register: async (username: string, email: string, password: string) => {
        try {
            set({ isLoading: true, error: null });
            const user = await authService.register(username, email, password);
            set({ 
                user,
                isAuthenticated: true,
                isLoading: false 
            });
        } catch (err) {
            set({ 
                error: err instanceof Error ? err.message : 'Erreur lors de l\'inscription',
                isLoading: false 
            });
            throw err;
        }
    },

    logout: async () => {
        try {
            set({ isLoading: true, error: null });
            await authService.logout();
            set({ 
                user: null,
                isAuthenticated: false,
                isLoading: false 
            });
        } catch (err) {
            set({ 
                error: err instanceof Error ? err.message : 'Erreur lors de la déconnexion',
                isLoading: false 
            });
        }
    },

    checkAuth: async () => {
        try {
            set({ isLoading: true, error: null });
            const user = await authService.getCurrentUser();
            set({ 
                user,
                isAuthenticated: !!user,
                isLoading: false 
            });
        } catch (err) {
            set({ 
                user: null,
                isAuthenticated: false,
                isLoading: false 
            });
        }
    }
})); 