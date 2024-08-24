"use client"

import React, { useState, useEffect } from 'react'
import DonationModal from './DonationModal'
import VoteModal from './VoteModal'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore'
import { ethers } from 'ethers'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface ChatMessage {
  id: string;
  created_at: Timestamp | null;
  interaction: string;
  is_comment: boolean;
  wallet_id: string;
}

interface ChatBoxProps {
  interactionStreamId: string; // 追加：このプロパティを親コンポーネントから渡す必要があります
}

const ChatBox: React.FC<ChatBoxProps> = ({ interactionStreamId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false)
  const [walletId, setWalletId] = useState<string | null>(null)

  useEffect(() => {
    const interactionsRef = collection(db, 'interaction_streams', interactionStreamId, 'interactions')
    const q = query(interactionsRef, orderBy('created_at', 'desc'))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages: ChatMessage[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data() as ChatMessage
        if (data.is_comment) {
          newMessages.push({ ...data, id: doc.id })
        }
      })
      setMessages(newMessages)
    })

    return () => unsubscribe()
  }, [interactionStreamId])

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        setWalletId(address)
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        alert("Failed to connect wallet. Please try again.")
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this feature.")
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletId) {
      await connectWallet()
    }
    if (newMessage.trim() && walletId) {
      const interactionsRef = collection(db, 'interaction_streams', interactionStreamId, 'interactions')
      
      try {
        await addDoc(interactionsRef, {
          interaction: newMessage,
          created_at: serverTimestamp(),
          is_comment: true,
          wallet_id: walletId,
        })
        setNewMessage('') // Clear input after sending
      } catch (error) {
        console.error("Error sending message: ", error)
        alert("Failed to send message. Please try again.")
      }
    }
  }

  const formatTimestamp = (timestamp: Timestamp | null) => {
    if (timestamp) {
      return timestamp.toDate().toLocaleTimeString()
    }
    return 'Pending...'
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="h-96 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-bold">{msg.wallet_id}: </span>
            <span>{msg.interaction}</span>
            <span className="text-xs text-gray-500 ml-2">
              {formatTimestamp(msg.created_at)}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow mr-2 p-2 border rounded"
            placeholder="Type a message..."
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Send
          </button>
        </div>
        <div className="flex mt-2 space-x-2">
          <button
            type="button"
            onClick={() => setIsDonationModalOpen(true)}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded"
          >
            Donate
          </button>
          <button
            type="button"
            onClick={() => setIsVoteModalOpen(true)}
            className="flex-1 bg-purple-500 text-white px-4 py-2 rounded"
          >
            Vote
          </button>
        </div>
      </form>
      {isDonationModalOpen && (
        <DonationModal 
          onClose={() => setIsDonationModalOpen(false)} 
          interactionStreamId={interactionStreamId}
        />
      )}
      {isVoteModalOpen && (
        <VoteModal onClose={() => setIsVoteModalOpen(false)} />
      )}
    </div>
  )
}

export default ChatBox