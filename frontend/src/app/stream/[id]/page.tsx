"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import StreamPlayer from '../../components/StreamPlayer'
import ChatBox from '../../components/ChatBox'
import { useTheme } from '../../../contexts/ThemeContext'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

// Firebaseの設定
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function StreamPage() {
  const { isDarkMode } = useTheme()
  const params = useParams()
  const [interactionStreamId, setInteractionStreamId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const streamName = 'live'
  const serverUrl = process.env.NEXT_PUBLIC_STREAM_SERVER_URL || 'http://localhost:8000'

  useEffect(() => {
    async function fetchInteractionStreamId() {
      setIsLoading(true)
      setError(null)

      try {
        const documentId = params.id as string
        if (!documentId) {
          throw new Error('Stream ID not found in URL')
        }

        const docRef = doc(db, 'contents', documentId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          setInteractionStreamId(data.interaction_stream_id)
        } else {
          throw new Error('Stream data not found')
        }
      } catch (err) {
        console.error('Error fetching interaction_stream_id:', err)
        setError('Failed to load stream data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInteractionStreamId()
  }, [params.id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className={`container mx-auto p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-2xl font-bold mb-4">Live Streaming Platform</h1>
      <div className="relative">
        <StreamPlayer streamName={streamName} serverUrl={serverUrl} />
      </div>
      <div className="mt-4">
        {interactionStreamId ? (
          <ChatBox interactionStreamId={interactionStreamId} />
        ) : (
          <div>Chat not available</div>
        )}
      </div>
    </div>
  )
}