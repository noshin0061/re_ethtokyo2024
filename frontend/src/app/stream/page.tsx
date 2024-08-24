"use client"

import React from 'react'
import StreamPlayer from '../components/StreamPlayer'
import ChatBox from '../components/ChatBox'
import HeartOverlay from '../components/HeartOverlay'
import BasketIcon from '../components/BasketIcon'
import EthereumModal from '../components/EthereumModal'
import ThemeToggle from '../components/ThemeToggle'
import { useTheme } from '../../contexts/ThemeContext'

export default function StreamPage() {
  const { isDarkMode } = useTheme()
  const streamName = 'live'
  const serverUrl = process.env.NEXT_PUBLIC_STREAM_SERVER_URL || 'http://localhost:8000'
  const interactionStreamId = '6336591a-18a5-4a6b-87f1-5595651c211d' // この値は適切に設定する必要があります

  console.log('Server URL:', serverUrl) // デバッグ用

  return (
    <div className={`container mx-auto p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-2xl font-bold mb-4">Live Streaming Platform</h1>
      <div className="relative">
        <StreamPlayer streamName={streamName} serverUrl={serverUrl} />
        {/* HeartOverlayなどの他のコンポーネントがあればここに配置 */}
      </div>
      <div className="mt-4">
        <ChatBox interactionStreamId={interactionStreamId} />
        {/* BasketIconなどの他のコンポーネントがあればここに配置 */}
      </div>
      {/* EthereumModalなどの他のコンポーネントがあればここに配置 */}
    </div>
  )
}