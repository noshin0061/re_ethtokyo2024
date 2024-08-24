"use client"

import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import AnonymousVotingArtifact from '../../../../backend/artifacts/contracts/AnonymousVoting.sol/AnonymousVoting.json'
import { generateProof } from '../../utils/generate-proof' // フロントエンドのutils/generate-proof.tsを参照するように変更

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
                setStatus('ウォレットが接続されました')
            } catch (error) {
                console.error('Failed to connect wallet:', error)
                setStatus('ウォレットの接続に失敗しました')
            }
        } else {
            setStatus('MetaMaskがインストールされていません')
        }
    }

    const handleVote = async () => {
      if (!isConnected || vote === null) {
          setStatus('ウォレットを接続し、評価を選択してください');
          return;
      }
      setStatus('処理中...');
  
      try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
  
          const contract = new ethers.Contract(ANONYMOUS_VOTING_ADDRESS, AnonymousVotingArtifact.abi, signer);
  
          const nullifier = ethers.utils.randomBytes(32);
          const secret = ethers.utils.randomBytes(32);
  
          const { proof, publicSignals } = await generateProof(
              vote ? 1 : 0,
              ethers.utils.hexlify(nullifier),
              ethers.utils.hexlify(secret)
          );
  
          // プルーフデータの形式を調整
          const pA = [proof.pi_a[0], proof.pi_a[1]];
          const pB = [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]];
          const pC = [proof.pi_c[0], proof.pi_c[1]];
          const pubSignals = publicSignals.map(signal => ethers.BigNumber.from(signal));
  
          console.log("Sending proof:", { pA, pB, pC, pubSignals });
  
          const tx = await contract.castVote(pA, pB, pC, pubSignals);
  
          setStatus('トランザクション処理中...');
          await tx.wait();
          setStatus('投票が完了しました！');
      } catch (error: any) {
          console.error('投票エラー:', error);
          if (error.reason) {
              setStatus(`投票に失敗しました: ${error.reason}`);
          } else if (error.message) {
              setStatus(`投票に失敗しました: ${error.message}`);
          } else {
              setStatus('投票に失敗しました: 不明なエラー');
          }
      }
  };
      

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">配信者を評価する</h2>
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
              投票する
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

export default VoteModal