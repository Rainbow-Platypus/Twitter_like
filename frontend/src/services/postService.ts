import axios from 'axios';

export interface Post {
    id: number;
    content: string;
    imageUrl?: string;
    createdAt: string;
    author: {
        id: number;
        username: string;
    };
}

const API_URL = 'http://localhost:8000/api';

export const postService = {
    createPost: async (content: string, image?: File): Promise<Post> => {
        const formData = new FormData();
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        const response = await axios.post(`${API_URL}/posts`, formData, {
            headers: {
                'Accept': 'application/json',
            },
            withCredentials: true
        });
        return response.data;
    },

    getPosts: async (): Promise<Post[]> => {
        const response = await axios.get(`${API_URL}/posts/feed`, {
            withCredentials: true
        });
        return response.data.posts;
    },

    deletePost: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/posts/${id}`, {
            withCredentials: true
        });
    },

    updatePost: async (id: number, content: string): Promise<Post> => {
        const formData = new FormData();
        formData.append('content', content);

        const response = await axios.put(
            `${API_URL}/posts/${id}`,
            formData,
            { 
                headers: {
                    'Accept': 'application/json',
                },
                withCredentials: true 
            }
        );
        return response.data;
    }
}; 