import { create } from 'zustand'

interface User {
  id: string
  username: string
  email: string
  avatar?: string
}

interface Post {
  id: string
  content: string
  author: User
  createdAt: string
  likes: number
  comments: number
  image?: string
}

interface Store {
  user: User | null
  posts: Post[]
  setUser: (user: User | null) => void
  addPost: (post: Post) => void
  likePost: (postId: string) => void
}

export const useStore = create<Store>((set) => ({
  user: null,
  posts: [],
  setUser: (user) => set({ user }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  likePost: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ),
    })),
}))

export default useStore 