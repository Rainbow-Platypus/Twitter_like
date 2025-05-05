import create from 'zustand';
import { Post, postService } from '../services/postService';

interface PostStore {
    posts: Post[];
    isLoading: boolean;
    error: string | null;
    fetchPosts: () => Promise<void>;
    addPost: (post: Post) => void;
    removePost: (id: number) => void;
    updatePost: (id: number, content: string) => Promise<void>;
}

export const usePostStore = create<PostStore>((set, get) => ({
    posts: [],
    isLoading: false,
    error: null,

    fetchPosts: async () => {
        set({ isLoading: true, error: null });
        try {
            const posts = await postService.getPosts();
            set({ posts, isLoading: false });
        } catch (err) {
            set({ 
                error: err instanceof Error ? err.message : 'Erreur lors du chargement des posts',
                isLoading: false 
            });
        }
    },

    addPost: (post: Post) => {
        set(state => ({
            posts: [post, ...state.posts]
        }));
    },

    removePost: (id: number) => {
        set(state => ({
            posts: state.posts.filter(post => post.id !== id)
        }));
    },

    updatePost: async (id: number, content: string) => {
        try {
            const updatedPost = await postService.updatePost(id, content);
            set(state => ({
                posts: state.posts.map(post =>
                    post.id === id ? updatedPost : post
                )
            }));
        } catch (err) {
            set({ 
                error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour du post'
            });
            throw err;
        }
    }
})); 