"use client"

import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import AnonymousVotingArtifact from '../../../../backend/artifacts/contracts/AnonymousVoting.sol/AnonymousVoting.json' // コントラクトのABI
import { generateProof } from '../../../../backend/scripts/generate-proof' // ZKプルーフ生成関数

const ANONYMOUS_VOTING_ADDRESS = "0xC59A20825F6cB5d8d9424c9cE3b5F0A81CfE9618";

interface VoteModalProps {
    onClose: () => void;
  }
  
  const VoteModal: React.FC<VoteModalProps> = ({ onClose }) => {
    const [vote, setVote] = useState<boolean | null>(null)
    const [status, setStatus] = useState('')
    const [isConnected, setIsConnected] = useState(false)
  
    useEffect(() => {
      checkConnection()
    }, [])
  
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
          setStatus('Wallet connected')
        } catch (error) {
          console.error('Failed to connect wallet:', error)
          setStatus('Failed to connect wallet')
        }
      } else {
        setStatus('MetaMask is not installed')
      }
    }
  
    const handleVote = async () => {
        if (!isConnected) {
          setStatus('Please connect your wallet');
          return;
        }
        if (vote === null) {
          setStatus('Please select a vote');
          return;
        }
        setStatus('Generating ZK proof...');
      
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
      
          const contract = new ethers.Contract(ANONYMOUS_VOTING_ADDRESS, AnonymousVotingArtifact.abi, signer);
      
          const nullifier = ethers.utils.randomBytes(32);
          const secret = ethers.utils.randomBytes(32);
      
          // APIルートにリクエストを送信してZKプルーフを生成
          const response = await fetch('/api/generateProof', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vote: vote ? 1 : 0, nullifier: ethers.utils.hexlify(nullifier), secret: ethers.utils.hexlify(secret) }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to generate ZK proof');
          }
      
          const { proof, publicSignals } = await response.json();
      
          const tx = await contract.castVote(proof.pi_a, proof.pi_b, proof.pi_c, publicSignals);
      
          setStatus('Processing vote...');
          await tx.wait();
          setStatus('Vote successful!');
        } catch (error: any) {
          console.error('Vote Error', error);
          setStatus(`Failed to vote`);
        }
      };
      

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Vote</h2>
        {!isConnected && (
          <button
            onClick={connectWallet}
            className="w-full bg-green-500 text-white p-3 rounded font-bold mb-4"
          >
            Connect Wallet
          </button>
        )}
        {isConnected && (
          <>
            <div className="mb-4 flex justify-center space-x-4">
              <button
                onClick={() => setVote(true)}
                className={`px-6 py-3 rounded text-xl font-bold ${vote === true ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              >
                👍 Positive
              </button>
              <button
                onClick={() => setVote(false)}
                className={`px-6 py-3 rounded text-xl font-bold ${vote === false ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
              >
                👎 Negative
              </button>
            </div>
            <button
              onClick={handleVote}
              className="w-full bg-blue-500 text-white p-3 rounded font-bold mb-2"
            >
              Vote
            </button>
          </>
        )}
        <button
          onClick={onClose}
          className="w-full bg-gray-300 p-3 rounded font-bold"
        >
          Close
        </button>
        {status && <p className="mt-4 text-center">{status}</p>}
      </div>
    </div>
  )
}

export default VoteModal