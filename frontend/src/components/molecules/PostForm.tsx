import React, { useState } from 'react'
import { useStore } from '../../store/useStore'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import Avatar from '../atoms/Avatar'

const PostForm: React.FC = () => {
  const [content, setContent] = useState('')
  const { user, addPost } = useStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !user) return

    const newPost = {
      id: Date.now().toString(),
      content: content.trim(),
      author: user,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
    }

    addPost(newPost)
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex space-x-4">
        <Avatar src={user?.avatar} alt={user?.username || 'User'} size="md" />
        <div className="flex-1">
          <Input
            placeholder="Quoi de neuf ?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
          />
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              disabled={!content.trim()}
              variant="primary"
              size="md"
            >
              Publier
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PostForm 