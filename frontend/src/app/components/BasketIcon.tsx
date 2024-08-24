import React from 'react'

interface BasketIconProps {
  heartCount: number
  onClick: () => void
}

const BasketIcon: React.FC<BasketIconProps> = ({ heartCount, onClick }) => {
  return (
    <button
      className="relative bg-yellow-500 text-white p-2 rounded-full ml-4"
      onClick={onClick}
    >
      🧺
      {heartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
          {heartCount}
        </span>
      )}
    </button>
  )
}

export default BasketIcon