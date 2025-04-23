import React from 'react'
import { useStore } from '@/store/useStore'
import MainLayout from '@/components/templates/MainLayout'
import PostForm from '@/components/molecules/PostForm'
import PostCard from '@/components/molecules/PostCard'

const Home: React.FC = () => {
  const { posts } = useStore()

  return (
    <MainLayout>
      <div className="space-y-6">
        <PostForm />
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

export default Home 