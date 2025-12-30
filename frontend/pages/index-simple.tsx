import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const HomeSimple: NextPage = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('bg-BG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <Head>
        <title>SoftArt AI HUB - AI Tools Platform</title>
        <meta name="description" content="Internal AI tools sharing platform for SoftArt AI HUB" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SoftArt AI HUB</h1>
                <p className="text-purple-200 text-sm">AI Tools Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-purple-200 text-sm hidden md:block">
                {currentTime}
              </div>
              <nav className="hidden md:flex space-x-4 items-center">
                <Link href="/tools" className="text-purple-200 hover:text-white font-medium transition-colors">
                  Browse Tools
                </Link>
                <Link href="/tools/new" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25">
                  Add Tool
                </Link>
                <a
                  href="http://localhost:8000/login"
                  className="text-purple-200 hover:text-white font-medium border border-purple-500/30 hover:border-purple-400 px-6 py-2 rounded-lg transition-all duration-200 hover:bg-purple-500/10"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Login
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-6 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover & Share
            <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent">
              AI Tools
            </span>
          </h1>
          <p className="text-xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Your internal platform for discovering, sharing, and collaborating on AI tools,
            libraries, and applications across the SoftArt AI HUB team.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              href="/tools"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105"
            >
              Browse AI Tools
            </Link>
            <a
              href="http://localhost:8000/login"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-purple-400 hover:border-purple-300 text-purple-200 hover:text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
            >
              Share Your Tool
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold">SoftArt AI HUB</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering teams with AI tools and collaboration
            </p>
            <p className="text-sm text-gray-500">
              © 2025 SoftArt AI HUB. Internal AI Tools Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeSimple;

