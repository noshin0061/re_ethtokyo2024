// components/DonationForm.tsx
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getEthPrice, jpyToEth } from '@/utils/getEthPrice'

interface DonationFormProps {
  account: string
}

const DonationForm: React.FC<DonationFormProps> = ({ account }) => {
  const [jpyAmount, setJpyAmount] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [status, setStatus] = useState('')
  const [ethPrice, setEthPrice] = useState<number | null>(null)

  useEffect(() => {
    getEthPrice().then(setEthPrice).catch(console.error)
  }, [])

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Processing...')
    
    if (typeof window.ethereum !== 'undefined' && ethPrice) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        
        const network = await provider.getNetwork()
        console.log('Current network:', network.name)

        const expectedNetwork = process.env.NEXT_PUBLIC_NETWORK_NAME
        if (expectedNetwork && network.name !== expectedNetwork) {
          setStatus(`Please switch to ${expectedNetwork} network`)
          return
        }

        const ethAmount = jpyToEth(parseFloat(jpyAmount), ethPrice)

        const tx = await signer.sendTransaction({
          to: recipientAddress,
          value: ethers.utils.parseEther(ethAmount)
        })

        setStatus('Waiting for transaction to be mined...')
        const receipt = await tx.wait()
        console.log('Transaction receipt:', receipt)
        setStatus('Donation successful!')
      } catch (error: any) {
        console.error('Error making donation:', error)
        setStatus(`Donation failed: ${error.message || 'Unknown error occurred'}`)
      }
    }
  }

  return (
    <form onSubmit={handleDonation} className="my-4">
      <input 
        type="number" 
        value={jpyAmount} 
        onChange={(e) => setJpyAmount(e.target.value)}
        placeholder="Amount in JPY"
        className="border p-2 mr-2"
      />
      <input 
        type="text" 
        value={recipientAddress} 
        onChange={(e) => setRecipientAddress(e.target.value)}
        placeholder="Recipient's Ethereum address"
        className="border p-2 mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Donate</button>
      {status && <p className="mt-2">{status}</p>}
      {ethPrice && <p className="mt-2">Current ETH price: ¥{ethPrice.toLocaleString()}</p>}
    </form>
  )
}

export default DonationForm