import React, { useState } from 'react'
import { ethers } from 'ethers'

interface EthereumModalProps {
  heartCount: number
  onClose: () => void
}

const EthereumModal: React.FC<EthereumModalProps> = ({ heartCount, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendTransaction = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        const transaction = await signer.sendTransaction({
          to: "0xYourRecipientAddressHere", // Replace with the actual recipient address
          value: ethers.utils.parseEther((0.0001 * heartCount).toString())
        })

        await transaction.wait()
        onClose()
      } else {
        throw new Error("MetaMask is not installed")
      }
    } catch (err) {
      setError("An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Send Ethereum</h2>
        <p>Hearts collected: {heartCount}</p>
        <p>Amount to send: {(0.0001 * heartCount).toFixed(4)} ETH</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="mt-4 flex justify-end">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={sendTransaction}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send ETH'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EthereumModal