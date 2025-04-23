import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import Avatar from '../atoms/Avatar'
import Button from '../atoms/Button'
import {
  HomeIcon,
  UserIcon,
  BellIcon,
  BookmarkIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const Sidebar: React.FC = () => {
  const { user } = useStore()
  const location = useLocation()

  const menuItems = [
    { icon: HomeIcon, label: 'Accueil', href: '/' },
    { icon: UserIcon, label: 'Profil', href: '/profile' },
    { icon: BellIcon, label: 'Notifications', href: '/notifications' },
    { icon: BookmarkIcon, label: 'Favoris', href: '/bookmarks' },
    { icon: Cog6ToothIcon, label: 'Paramètres', href: '/settings' },
  ]

  const navigation = [
    { name: 'Accueil', href: '/', icon: '🏠' },
    { name: 'Explorer', href: '/explore', icon: '🔍' },
    { name: 'Notifications', href: '/notifications', icon: '🔔' },
    { name: 'Messages', href: '/messages', icon: '✉️' },
    { name: 'Profil', href: '/profile', icon: '👤' },
    { name: 'Créer un post', href: '/create-post', icon: '✏️' },
  ]

  return (
    <div className="h-screen bg-white shadow-md">
      <div className="p-4">
        <Link to="/" className="flex items-center space-x-2 mb-8">
          <span className="text-2xl font-bold text-blue-600">Twitter Clone</span>
        </Link>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.href
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-8">
          <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Se connecter
          </button>
        </div>
      </div>

      {user && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-3">
            <Avatar src={user.avatar} alt={user.username} size="sm" />
            <div>
              <p className="font-medium text-gray-900">{user.username}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar 