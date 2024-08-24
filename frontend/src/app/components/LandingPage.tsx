import React from 'react';
import Link from 'next/link';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-4">
    {icon}
    <h3 className="text-xl font-semibold mt-2">{title}</h3>
    <p className="mt-2">{description}</p>
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to StreamConnect</h1>
        <p className="text-xl mb-8">Experience real-time streaming like never before</p>
        <div className="space-y-4">
          <Link href="/stream" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full inline-flex items-center">
            Start Watching →
          </Link>
          <div>
            <Link href="/broadcast" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full inline-flex items-center">
              Start Broadcasting →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose StreamConnect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature 
              icon={<span className="text-3xl">📺</span>}
              title="High-Quality Streams"
              description="Enjoy crystal-clear video and audio streaming."
            />
            <Feature 
              icon={<span className="text-3xl">💬</span>}
              title="Interactive Chat"
              description="Engage with other viewers in real-time chat."
            />
            <Feature 
              icon={<span className="text-3xl">👥</span>}
              title="Community-Driven"
              description="Join a vibrant community of streamers and viewers."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to dive in?</h2>
          <p className="text-xl mb-8">Join thousands of users already enjoying StreamConnect</p>
          <Link href="/stream" className="bg-white text-blue-500 hover:bg-blue-100 font-bold py-3 px-6 rounded-full">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;