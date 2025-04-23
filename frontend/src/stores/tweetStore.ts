import { create } from 'zustand'
import axios from 'axios'

interface Tweet {
  id: number
  content: string
  author: {
    id: number
    username: string
  }
  createdAt: string
  likes: number
}

interface TweetState {
  tweets: Tweet[]
  loading: boolean
  error: string | null
  fetchTweets: () => Promise<void>
  createTweet: (content: string) => Promise<void>
  likeTweet: (tweetId: number) => Promise<void>
  deleteTweet: (tweetId: number) => Promise<void>
}

export const useTweetStore = create<TweetState>((set, get) => ({
  tweets: [],
  loading: false,
  error: null,

  fetchTweets: async () => {
    set({ loading: true, error: null })
    try {
      const response = await axios.get('/api/tweets')
      set({ tweets: response.data, loading: false })
    } catch (error) {
      set({ error: 'Erreur lors du chargement des tweets', loading: false })
    }
  },

  createTweet: async (content: string) => {
    try {
      const response = await axios.post('/api/tweets', { content })
      set({ tweets: [response.data, ...get().tweets] })
    } catch (error) {
      set({ error: 'Erreur lors de la création du tweet' })
    }
  },

  likeTweet: async (tweetId: number) => {
    try {
      await axios.post(`/api/tweets/${tweetId}/like`)
      set({
        tweets: get().tweets.map(tweet =>
          tweet.id === tweetId
            ? { ...tweet, likes: tweet.likes + 1 }
            : tweet
        )
      })
    } catch (error) {
      set({ error: 'Erreur lors du like du tweet' })
    }
  },

  deleteTweet: async (tweetId: number) => {
    try {
      await axios.delete(`/api/tweets/${tweetId}`)
      set({
        tweets: get().tweets.filter(tweet => tweet.id !== tweetId)
      })
    } catch (error) {
      set({ error: 'Erreur lors de la suppression du tweet' })
    }
  }
})) 