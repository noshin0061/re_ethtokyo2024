import React from 'react'

interface ConnectWalletProps {
  setAccount: (account: string) => void
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ setAccount }) => {
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  return (
    <button onClick={connectWallet} className="bg-green-500 text-white p-2 rounded">
      Connect MetaMask Wallet
    </button>
  )
}

export default ConnectWallet
