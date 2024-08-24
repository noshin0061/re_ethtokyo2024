// components/ThemeToggle.tsx
import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-full ${
        isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'
      }`}
    >
      {isDarkMode ? '🌞' : '🌙'}
    </button>
  )
}

export default ThemeToggle