import React, { useEffect, useState } from 'react'

interface HeartProps {
  id: number
  style: React.CSSProperties
}

const Heart: React.FC<HeartProps> = ({ id, style }) => (
  <div
    key={id}
    className="absolute text-red-500 animate-float"
    style={style}
  >
    ❤️
  </div>
)

interface HeartOverlayProps {
  heartCount: number
}

const HeartOverlay: React.FC<HeartOverlayProps> = ({ heartCount }) => {
  const [hearts, setHearts] = useState<HeartProps[]>([])

  useEffect(() => {
    if (heartCount > hearts.length) {
      const newHearts = Array.from({ length: heartCount - hearts.length }, (_, index) => ({
        id: hearts.length + index,
        style: {
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 2 + 3}s`,
        },
      }))
      setHearts([...hearts, ...newHearts])
    }
  }, [heartCount])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((heart) => (
        <Heart key={heart.id} {...heart} />
      ))}
    </div>
  )
}

export default HeartOverlay