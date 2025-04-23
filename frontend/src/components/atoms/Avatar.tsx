import React from 'react'

interface AvatarProps {
  src?: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md' }) => {
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-300">
          <span className="text-gray-500 text-lg font-medium">
            {alt.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}

export default Avatar 