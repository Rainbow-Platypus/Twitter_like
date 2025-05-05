import axios from 'axios';

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface LoginResponse {
    user: User;
}

const API_URL = 'http://localhost:8000/api';

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await axios.post(
            `${API_URL}/login`,
            { email, password },
            { withCredentials: true }
        );
        return response.data;
    },

    register: async (username: string, email: string, password: string): Promise<LoginResponse> => {
        const response = await axios.post(
            `${API_URL}/register`,
            { username, email, password },
            { withCredentials: true }
        );
        return response.data;
    },

    logout: async (): Promise<void> => {
        await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    },

    getCurrentUser: async (): Promise<User | null> => {
        try {
            const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
            return response.data.user;
        } catch {
            return null;
        }
    },

    isAuthenticated: async (): Promise<boolean> => {
        try {
            await axios.get(`${API_URL}/me`, { withCredentials: true });
            return true;
        } catch {
            return false;
        }
    }
}; 