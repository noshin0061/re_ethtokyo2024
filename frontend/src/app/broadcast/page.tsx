'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function BroadcastPage() {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startBroadcasting = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setIsBroadcasting(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Failed to access camera and microphone. Please ensure you have given the necessary permissions.');
    }
  };

  const stopBroadcasting = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsBroadcasting(false);
    }
  };

  useEffect(() => {
    if (isBroadcasting && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(error => console.error('Error playing video:', error));
    } else if (!isBroadcasting && videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [isBroadcasting]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Start Your Broadcast</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="streamKey" className="block text-sm font-medium text-gray-700">Stream Key</label>
          <input type="text" id="streamKey" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Enter your stream key" />
        </div>
        <div className="mb-4">
          <label htmlFor="serverUrl" className="block text-sm font-medium text-gray-700">Server URL</label>
          <input type="text" id="serverUrl" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="rtmp://your-server-url/live" />
        </div>
        <button 
          onClick={isBroadcasting ? stopBroadcasting : startBroadcasting}
          className={`${isBroadcasting ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-2 px-4 rounded`}
        >
          {isBroadcasting ? 'Stop Broadcasting' : 'Start Broadcasting'}
        </button>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Broadcast Preview</h2>
        <div className="bg-black w-full aspect-video rounded-lg flex items-center justify-center text-white">
          {isBroadcasting ? (
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover rounded-lg" />
          ) : (
            <p>Your stream preview will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
}