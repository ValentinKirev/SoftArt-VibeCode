import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Home: NextPage = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

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

    // Trigger page load animation
    setTimeout(() => setIsLoaded(true), 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Head>
        <title>SoftArt AI HUB - AI Tools Platform</title>
        <meta name="description" content="Internal AI tools sharing platform for SoftArt AI HUB" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className={`bg-black/20 backdrop-blur-sm border-b border-purple-500/20 transition-all duration-700 ${isLoaded ? 'animate-fade-in-down' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow transition-transform duration-300 hover:scale-110 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
                <span className="text-white font-bold text-xl animate-bounce-gentle">AI</span>
              </div>
              <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'}`}>
                <h1 className="text-2xl font-bold text-white text-shadow">SoftArt AI HUB</h1>
                <p className="text-purple-200 text-sm">AI Tools Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`text-purple-200 text-sm hidden md:block bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm border border-purple-500/20 transition-all duration-300 hover:bg-purple-500/10 animate-float ${isLoaded ? 'animate-fade-in-down' : 'opacity-0'}`}>
                <span className="font-mono text-xs">{currentTime}</span>
              </div>
              <nav className={`hidden md:flex space-x-4 items-center transition-all duration-700 delay-300 ${isLoaded ? 'animate-fade-in-down' : 'opacity-0'}`}>
                <Link href="/tools" className="text-purple-200 hover:text-white font-medium transition-all duration-200 hover:scale-105 relative group">
                  Browse Tools
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link href="/tools/new" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 hover:-translate-y-0.5 glow-effect">
                  Add Tool
                </Link>
                <a
                  href="http://localhost:8000/login"
                  className="text-purple-200 hover:text-white font-medium border border-purple-500/30 hover:border-purple-400 px-6 py-2 rounded-lg transition-all duration-200 hover:bg-purple-500/10 transform hover:scale-105 hover:-translate-y-0.5 relative group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Login
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </a>
              </nav>
              {/* Mobile menu button */}
              <div className={`md:hidden transition-all duration-700 delay-400 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
                <button className="text-purple-200 hover:text-white transition-all duration-200 hover:scale-110 p-2 rounded-lg hover:bg-purple-500/10">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="text-center relative z-10">
          <div className={`mb-8 transition-all duration-700 delay-500 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-6 shadow-2xl animate-pulse-glow animate-gradient-xy relative group">
              <svg className="w-10 h-10 text-white animate-bounce-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"></div>
            </div>
          </div>

          <h1 className={`text-5xl md:text-7xl font-bold text-white mb-6 leading-tight text-shadow-lg transition-all duration-700 delay-300 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            Discover & Share
            <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent animate-gradient-x">
              AI Tools
            </span>
          </h1>

          <p className={`text-xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-500 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
            Your internal platform for discovering, sharing, and collaborating on AI tools,
            libraries, and applications across the SoftArt AI HUB team.
          </p>

          <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 transition-all duration-700 delay-700 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <Link
              href="/tools"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 hover:-translate-y-1 glow-effect relative overflow-hidden group"
            >
              <span className="relative z-10">Browse AI Tools</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
            <a
              href="http://localhost:8000/login"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-purple-400 hover:border-purple-300 text-purple-200 hover:text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
            >
              <span className="relative z-10">Share Your Tool</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 transition-all duration-700 delay-900 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 text-center hover:bg-black/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse-glow group-hover:animate-bounce-gentle transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">Discover Tools</h3>
            <p className="text-purple-200 group-hover:text-purple-100 transition-colors duration-300">
              Find AI tools, libraries, and frameworks shared by your colleagues across different teams and projects.
            </p>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 text-center hover:bg-black/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group cursor-pointer" style={{animationDelay: '0.2s'}}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse-glow group-hover:animate-bounce-gentle transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-green-300 transition-colors duration-300">Team Collaboration</h3>
            <p className="text-purple-200 group-hover:text-purple-100 transition-colors duration-300">
              Share your discoveries and learn from others. Build better AI solutions together as a team.
            </p>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-full h-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 text-center hover:bg-black/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group cursor-pointer" style={{animationDelay: '0.4s'}}>
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse-glow group-hover:animate-bounce-gentle transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-pink-300 transition-colors duration-300">Stay Updated</h3>
            <p className="text-purple-200 group-hover:text-purple-100 transition-colors duration-300">
              Keep track of the latest AI tools and technologies being used across your organization.
            </p>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 mt-20 transition-all duration-700 delay-1100 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white text-shadow">Platform Statistics</h2>
            <p className="text-purple-200 mt-2">See how our AI tools platform is growing</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-lg p-4 border border-purple-500/20 hover:bg-gradient-to-br hover:from-purple-600/30 hover:to-indigo-600/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group cursor-pointer">
              <div className="text-3xl font-bold text-purple-400 mb-2 animate-float">∞</div>
              <div className="text-purple-200 group-hover:text-purple-100 transition-colors duration-300">AI Tools Shared</div>
              <div className="w-full h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-2"></div>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-teal-600/20 rounded-lg p-4 border border-green-500/20 hover:bg-gradient-to-br hover:from-green-600/30 hover:to-teal-600/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group cursor-pointer" style={{animationDelay: '0.1s'}}>
              <div className="text-3xl font-bold text-green-400 mb-2 animate-float">∞</div>
              <div className="text-purple-200 group-hover:text-green-100 transition-colors duration-300">Team Members</div>
              <div className="w-full h-0.5 bg-gradient-to-r from-green-500 to-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-2"></div>
            </div>
            <div className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-lg p-4 border border-pink-500/20 hover:bg-gradient-to-br hover:from-pink-600/30 hover:to-purple-600/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group cursor-pointer" style={{animationDelay: '0.2s'}}>
              <div className="text-3xl font-bold text-pink-400 mb-2 animate-float">∞</div>
              <div className="text-purple-200 group-hover:text-pink-100 transition-colors duration-300">Categories</div>
              <div className="w-full h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-2"></div>
            </div>
            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-lg p-4 border border-orange-500/20 hover:bg-gradient-to-br hover:from-orange-600/30 hover:to-red-600/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group cursor-pointer" style={{animationDelay: '0.3s'}}>
              <div className="text-3xl font-bold text-orange-400 mb-2 animate-float">∞</div>
              <div className="text-purple-200 group-hover:text-orange-100 transition-colors duration-300">Success Stories</div>
              <div className="w-full h-0.5 bg-gradient-to-r from-orange-500 to-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-2"></div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center mt-16 transition-all duration-700 delay-1300 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl font-bold text-white mb-4 text-shadow">
            Ready to explore AI tools?
          </h2>
          <p className="text-purple-200 mb-8">
            Join your colleagues in discovering and sharing the latest AI technologies.
          </p>
          <Link
            href="/tools"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 hover:-translate-y-1 glow-effect relative overflow-hidden group"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className={`bg-gray-900 text-white mt-20 transition-all duration-700 delay-1500 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
          {/* Animated background elements for footer */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-10 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-indigo-500/5 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}}></div>
          </div>

          <div className="text-center relative z-10">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center animate-pulse-glow">
                <span className="text-white font-bold text-sm animate-bounce-gentle">AI</span>
              </div>
              <span className="text-xl font-bold text-white text-shadow">SoftArt AI HUB</span>
            </div>
            <p className="text-gray-400 mb-4 transition-colors duration-300 hover:text-purple-300">
              Empowering teams with AI tools and collaboration
            </p>
            <p className="text-sm text-gray-500 transition-colors duration-300 hover:text-purple-400">
              © 2025 SoftArt AI HUB. Internal AI Tools Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;





