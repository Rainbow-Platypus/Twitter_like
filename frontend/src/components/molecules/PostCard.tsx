import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import Avatar from '../atoms/Avatar'
import Button from '../atoms/Button'
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'

interface Post {
  id: string
  content: string
  author: {
    id: string
    username: string
    avatar?: string
  }
  createdAt: string
  likes: number
  comments: number
  image?: string
}

interface PostCardProps {
  post: Post
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { likePost } = useStore()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    }).format(date)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start space-x-4">
        <Link to={`/profile/${post.author.username}`}>
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        </Link>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Link to={`/profile/${post.author.username}`} className="font-bold hover:underline">
              {post.author.username}
            </Link>
            <span className="text-gray-500 text-sm">@{post.author.username}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="mt-2">{post.content}</p>
          {post.image && (
            <div className="mt-4">
              <img
                src={post.image}
                alt="Post content"
                className="rounded-lg max-h-96 w-full object-cover"
              />
            </div>
          )}
          <div className="flex items-center space-x-4 mt-4 text-gray-500">
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{post.comments}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard 