import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

interface User {
  id: number
  username: string
  email: string
  token: string
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await axios.post('/api/login', { email, password })
          const { token, user } = response.data
          
          set({ user: { ...user, token }, isAuthenticated: true })
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } catch (error) {
          throw new Error('Échec de la connexion')
        }
      },

      register: async (username: string, email: string, password: string) => {
        try {
          const response = await axios.post('/api/register', {
            username,
            email,
            password,
          })
          const { token, user } = response.data
          
          set({ user: { ...user, token }, isAuthenticated: true })
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } catch (error) {
          throw new Error('Échec de l\'inscription')
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
        delete axios.defaults.headers.common['Authorization']
      },
    }),
    {
      name: 'user-storage',
    }
  )
) 