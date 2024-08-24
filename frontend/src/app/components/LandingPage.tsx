"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import db from '@/lib/firebase/firebase';
import { v4 as uuidv4 } from 'uuid';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Content {
  id: string;
  created_at: string;
  interaction_stream_id: string;
  wallet_id: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-4">
    {icon}
    <h3 className="text-xl font-semibold mt-2">{title}</h3>
    <p className="mt-2">{description}</p>
  </div>
);

const LandingPage: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [status, setStatus] = useState<string>('');

  const fetchContents = async () => {
    const contentsCollection = collection(db, 'contents');
    const contentsSnapshot = await getDocs(contentsCollection);
    const contentsList = contentsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        created_at: data.created_at.toDate().toLocaleString(),
        interaction_stream_id: data.interaction_stream_id,
        wallet_id: data.wallet_id
      } as Content;
    });
    setContents(contentsList);
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const loginWithMetamask = async (): Promise<boolean> => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return accounts.length > 0;
      } catch (error) {
        console.error('Metamaskログイン中にエラーが発生しました:', error);
        return false;
      }
    } else {
      console.warn('Metamaskが見つかりません');
      alert('Metamaskをインストールしてください');
      return false;
    }
  };

  const checkMetamaskLogin = async (): Promise<boolean> => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        return accounts.length > 0;
      } catch (error) {
        console.error('Metamaskログイン確認中にエラーが発生しました:', error);
        return false;
      }
    } else {
      console.warn('Metamaskが見つかりません');
      return false;
    }
  };

  const createContent = async () => {
    try {
      const isLoggedIn = await checkMetamaskLogin();
      if (!isLoggedIn) {
        const loginSuccess = await loginWithMetamask();
        if (!loginSuccess) {
          setStatus('Metamaskログインに失敗しました');
          return;
        }
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const walletId = accounts[0];

      const contentsCollection = collection(db, 'contents');
      const uuid = uuidv4(); // uuidライブラリを使用してUUIDを生成
      const newContent = {
        created_at: new Date(),
        interaction_stream_id: uuid,
        wallet_id: walletId
      };

      await addDoc(contentsCollection, newContent);
      setStatus('コンテンツが正常に作成されました');
      fetchContents();
    } catch (error) {
      console.error('コンテンツの作成中にエラーが発生しました:', error);
      setStatus('コンテンツの作成に失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">StreamConnectへようこそ</h1>
        <p className="text-xl mb-8">これまでにない実時間ストリーミング体験を</p>
        <div className="space-y-4">
          <Link href="/stream" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full inline-flex items-center">
            視聴を開始 →
          </Link>
          <div>
            <Link href={contents.length > 0 ? `/broadcast/${contents[0].id}` : '#'} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full inline-flex items-center">
              配信を開始 →
            </Link>
          </div>
        </div>
      </section>

      {/* Contents Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-500">利用可能なコンテンツ</h2>
          {status && <p className="text-center mb-4 text-green-600">{status}</p>}
          <div className="text-center mb-8">
            <button
              onClick={createContent}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              新しいコンテンツを作成
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <p className="text-xl font-semibold mb-4">利用可能なコンテンツ数: {contents.length}</p>
            {contents.map((content) => (
              <div key={content.id} className="border p-4 rounded-lg">
                <p className="text-sm text-gray-500">ドキュメントID: {content.id}</p>
                <p className="text-sm text-gray-500">作成日時: {content.created_at}</p>
                <p className="text-sm text-gray-500">インタクションストリームID: {content.interaction_stream_id}</p>
                <p className="text-sm text-gray-500">ウォレットID: {content.wallet_id}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">StreamConnectを選ぶ理由</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature 
              icon={<span className="text-3xl">📺</span>}
              title="高品質ストリーム"
              description="クリスタルクリアな映像と音声ストリーミングをお楽しみください。"
            />
            <Feature 
              icon={<span className="text-3xl">💬</span>}
              title="インタラクティブチャット"
              description="リアルタイムチャットで他の視聴者と交流しましょう。"
            />
            <Feature 
              icon={<span className="text-3xl">👥</span>}
              title="コミュニティ駆動"
              description="活気あふれるストリーマーと視聴者のコミュニティに参加しましょう。"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">始める準備はできましたか？</h2>
          <p className="text-xl mb-8">すでにStreamConnectを楽しんでいる数千人のユーザーに加わりましょう</p>
          <Link href="/stream" className="bg-white text-blue-500 hover:bg-blue-100 font-bold py-3 px-6 rounded-full">
            今すぐ始める
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;