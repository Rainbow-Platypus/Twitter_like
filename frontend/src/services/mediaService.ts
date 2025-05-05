import axios from 'axios';

export interface Media {
    id: number;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    createdAt: string;
}

const API_URL = 'http://localhost:8000/api';

export const mediaService = {
    uploadMedia: async (file: File): Promise<Media> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_URL}/media`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });
        return response.data;
    },

    deleteMedia: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/media/${id}`, {
            withCredentials: true
        });
    },

    getAllMedia: async (): Promise<Media[]> => {
        const response = await axios.get(`${API_URL}/media`);
        return response.data;
    },

    getMediaUrl: (filename: string): string => {
        return `${API_URL}/uploads/${filename}`;
    }
}; 