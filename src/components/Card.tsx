import React from 'react'

interface CardProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export default function Card({ title, description, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}
      {children}
    </div>
  )
}
