"use client"

import React from 'react'
import StreamPlayer from '../components/StreamPlayer'
import ChatBox from '../components/ChatBox'

export default function StreamPage() {
  const streamName = 'live'
  const serverUrl = process.env.NEXT_PUBLIC_STREAM_SERVER_URL || 'http://localhost:8000'

  console.log('Server URL:', serverUrl) // デバッグ用

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Live Streaming Platform</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <StreamPlayer streamName={streamName} serverUrl={serverUrl} />
        </div>
        <div className="w-full md:w-1/3">
          <ChatBox />
        </div>
      </div>
    </div>
  )
}