"use client"

import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getEthPrice, jpyToEth } from '@/utils/getEthPrice'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'

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

interface DonationModalProps {
  onClose: () => void;
  interactionStreamId: string; // 追加：このプロパティを親コンポーネントから渡す必要があります
}

const DonationModal: React.FC<DonationModalProps> = ({ onClose, interactionStreamId }) => {
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('')
  const [ethPrice, setEthPrice] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState('')

  const minAmount = 100 // 最小金額（円）
  const maxAmount = 100000 // 最大金額（円）
  const suggestedAmounts = [500, 1000, 5000, 10000] // よく使う金額（円）

  useEffect(() => {
    getEthPrice().then(setEthPrice).catch(console.error)
    checkConnection()
    fetchRecipientAddress()
  }, [interactionStreamId])

  const fetchRecipientAddress = async () => {
    try {
      const contentsRef = collection(db, 'contents')
      const q = query(contentsRef, where('interaction_stream_id', '==', interactionStreamId))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        setRecipientAddress(doc.data().wallet_id)
      } else {
        setStatus('寄付先アドレスが見つかりません')
      }
    } catch (error) {
      console.error('Error fetching recipient address:', error)
      setStatus('寄付先アドレスの取得に失敗しました')
    }
  }

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.listAccounts()
        setIsConnected(accounts.length > 0)
      } catch (error) {
        console.error('Connection check failed:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        setIsConnected(true)
        setStatus('ウォレットが接続されました')
      } catch (error) {
        console.error('Failed to connect wallet:', error)
        setStatus('ウォレットの接続に失敗しました')
      }
    } else {
      setStatus('MetaMaskがインストールされていません')
    }
  }

  const handleNumberClick = (num: string) => {
    if (num === '.' && amount.includes('.')) return
    const newAmount = amount + num
    if (parseFloat(newAmount) <= maxAmount) {
      setAmount(newAmount)
    }
  }

  const handleDelete = () => {
    setAmount(amount.slice(0, -1))
  }

  const handleSuggestedAmount = (suggestedAmount: number) => {
    setAmount(suggestedAmount.toString())
  }

  const handleDonation = async () => {
    if (!isConnected) {
      setStatus('まずウォレットを接続してください')
      return
    }
    if (!ethers.utils.isAddress(recipientAddress)) {
      setStatus('無効な寄付先アドレスです')
      return
    }
    if (parseFloat(amount) < minAmount) {
      setStatus(`最小金額は${minAmount}円です`)
      return
    }
    setStatus('処理中...')
    
    try {
      if (!ethPrice) throw new Error('ETH価格が取得できませんでした')
      const ethAmount = jpyToEth(parseFloat(amount), ethPrice)

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: ethers.utils.parseEther(ethAmount)
      })

      setStatus('トランザクション処理中...')
      await tx.wait()
      setStatus('寄付が完了しました！')
    } catch (error: any) {
      console.error('寄付エラー:', error)
      setStatus(`寄付に失敗しました: ${error.message}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">寄付する</h2>
        {!isConnected && (
          <button
            onClick={connectWallet}
            className="w-full bg-green-500 text-white p-3 rounded font-bold mb-4"
          >
            ウォレットを接続
          </button>
        )}
        {isConnected && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">寄付先アドレスが設定されています</p>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold text-center mb-2">¥{amount}</div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'del'].map((num) => (
                  <button
                    key={num}
                    onClick={() => num === 'del' ? handleDelete() : handleNumberClick(num.toString())}
                    className="bg-gray-200 p-3 rounded text-xl font-bold"
                  >
                    {num === 'del' ? '←' : num}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm mb-2">よく使う金額:</div>
              <div className="flex justify-between">
                {suggestedAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleSuggestedAmount(amt)}
                    className="bg-blue-100 px-3 py-1 rounded"
                  >
                    ¥{amt}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleDonation}
              className="w-full bg-blue-500 text-white p-3 rounded font-bold mb-2"
            >
              寄付する
            </button>
          </>
        )}
        <button
          onClick={onClose}
          className="w-full bg-gray-300 p-3 rounded font-bold"
        >
          キャンセル
        </button>
        {status && <p className="mt-4 text-center">{status}</p>}
      </div>
    </div>
  )
}

export default DonationModal