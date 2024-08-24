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
        console.error('Problem occured while loggin in', error);
        return false;
      }
    } else {
      console.warn('Metamask not found');
      alert('Please install Metamask to use this application');
      return false;
    }
  };

  const checkMetamaskLogin = async (): Promise<boolean> => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        return accounts.length > 0;
      } catch (error) {
        console.error('Error occured while logging into Metamask', error);
        return false;
      }
    } else {
      console.warn('Metamask not found');
      return false;
    }
  };

  const createContent = async (): Promise<string | null> => {
    try {
      const isLoggedIn = await checkMetamaskLogin();
      if (!isLoggedIn) {
        const loginSuccess = await loginWithMetamask();
        if (!loginSuccess) {
          setStatus('Please login with Metamask to create content');
          return null;
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

      const docRef = await addDoc(contentsCollection, newContent);
      setStatus('Content created successfully');
      fetchContents();
      return docRef.id;
    } catch (error) {
      console.error('Error has occured creating contents', error);
      setStatus('Error creating content');
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Next Stream ➡︎</h1>
        <p className="text-xl mb-8">Dive into the new Live Stream 👉</p>
        <div className="space-y-4">
          <div>
            <Link 
              onClick={async (e) => {
                e.preventDefault();
                const newContentId = await createContent();
                if (newContentId) {
                  window.location.href = `/broadcast/${newContentId}`;
                }
              }} 
              href="#" 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full inline-flex items-center"
            >
              <span>One Click and You're on Live</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contents Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-500">⇩ Watch Now ⇩</h2>
          {status && <p className="text-center mb-4 text-green-600">{status}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contents.map((content) => (
              <Link href={`/stream/${content.id}`} key={content.id}>
                <div className="border p-4 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <p className="text-sm text-gray-500">DocumentId {content.id}</p>
                  <p className="text-sm text-gray-500">Created at: {content.created_at}</p>
                  <p className="text-sm text-gray-500">Comments: {content.interaction_stream_id}</p>
                  <p className="text-sm text-gray-500">StreamerID: {content.wallet_id}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why choose Next Stream ➡︎?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature 
              icon={<span className="text-3xl">📺</span>}
              title="High Quality Streaming"
              description="Enjoy high quality streaming with low latency."
            />
            <Feature 
              icon={<span className="text-3xl">💬</span>}
              title="Real-time Chat"
              description="Interact with streamers and viewers in real-time."
            />
            <Feature 
              icon={<span className="text-3xl">👥</span>}
              title="Community"
              description="Join a community of thousands of streamers and viewers."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Are You Ready to Enjoy?</h2>
          <Link onClick={createContent} href={contents.length > 0 ? `/broadcast/${contents[0].id}` : '#'} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full inline-flex items-center">
              <span>Stream Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;