"use client";

import React, { useState, useEffect } from 'react';

// Declare supabase as a global type
declare global {
  interface Window {
    supabase: any;
  }
}

export default function SocialGenLanding() {
  const [darkMode, setDarkMode] = useState(true);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState<{type: string; text: string} | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [hoveredLogin, setHoveredLogin] = useState(false);
  const [hoveredTheme, setHoveredTheme] = useState(false);
  const [hoveredLogo, setHoveredLogo] = useState(false);

  useEffect(() => {
    const items = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    items.forEach((item, index) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, item]);
      }, index * 100);
    });

    // Load Supabase from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;
    script.onload = () => {
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        const supabaseUrl = 'https://dbfygrskxsvlcmvvolgu.supabase.co';
        const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiZnlncnNreHN2bGNtdnZvbGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwOTczMTksImV4cCI6MjA3NDY3MzMxOX0.E20J6GwHWDmvD52U8tUobJwPZTt07GMAH5kpofixs3g';
        window.supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setLoginMessage(null);
    
    if (!loginEmail || !loginPassword) {
      setLoginMessage({ type: 'error', text: 'Please enter both email and password' });
      setIsLoggingIn(false);
      return;
    }

    if (!window.supabase) {
      setLoginMessage({ type: 'error', text: 'Please wait, loading...' });
      setIsLoggingIn(false);
      return;
    }
    
    try {
      const result = await window.supabase
        .from('Users')
        .select('*')
        .eq('e-mail', loginEmail.trim())
        .eq('Password', loginPassword.trim());
      
      if (result.error) throw result.error;
      
      if (result.data && result.data.length > 0) {
        const user = result.data[0];
        setLoginMessage({
          type: 'success',
          text: 'Welcome back, ' + user['Name Surname'] + '! Redirecting...'
        });
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('isLoggedIn', 'true');
        
        // Clear the form
        setLoginEmail('');
        setLoginPassword('');
        
        setTimeout(() => {
          window.location.href = 'members.html';
        }, 1500);
      } else {
        setLoginMessage({ type: 'error', text: 'Email & password did not match. Please try again.' });
      }
    } catch (error: any) {
      setLoginMessage({ type: 'error', text: 'Login failed: ' + error.message });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const generators = [
    {
      title: 'Social Media Posts',
      desc: 'Generate eye-catching posts optimized for Instagram, Twitter, Facebook, and LinkedIn. AI-powered captions and hashtags included.'
    },
    {
      title: 'Carousel Posts',
      desc: 'Create stunning multi-slide carousels that tell compelling stories. Perfect for educational content and product showcases.'
    },
    {
      title: 'AI Image Generation',
      desc: 'Transform text into stunning visuals. Generate custom images, graphics, and designs tailored to your brand.'
    },
    {
      title: 'Short Videos',
      desc: 'Create viral-ready short-form content for TikTok, Reels, and Shorts. Auto-captions, effects, and music suggestions.'
    },
    {
      title: 'Long-Form Videos',
      desc: 'Produce professional YouTube videos, tutorials, and webinars. Script generation, scene planning, and editing assistance.'
    },
    {
      title: 'Presentations',
      desc: 'Design beautiful presentations and pitch decks. Smart layouts, data visualization, and compelling storytelling.'
    },
    {
      title: 'Engagement Strategies',
      desc: 'AI-driven engagement plans, best posting times, content calendars, and growth tactics tailored to your audience.'
    },
    {
      title: 'Quiz Questions',
      desc: 'Generate interactive quizzes that boost engagement. Perfect for Stories, polls, and audience interaction.'
    },
    {
      title: 'SEO-Friendly Blog Posts',
      desc: 'Create optimized blog content that ranks. Keyword research, SEO optimization, meta descriptions, and compelling articles that drive traffic.'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-700 ${darkMode ? 'bg-orange-500' : 'bg-gray-50'}`}>
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowLogin(false)}>
          <div className={`w-full max-w-md rounded-3xl p-8 ${darkMode ? 'bg-zinc-800 border border-zinc-700' : 'bg-white border border-gray-200'} shadow-2xl`} onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-light ${darkMode ? 'text-white' : 'text-black'}`}>Login</h2>
            </div>

            <div>
              <div className="mb-4">
                <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 rounded-xl transition-all ${
                    darkMode 
                      ? 'bg-zinc-900 border border-zinc-700 text-white focus:border-orange-500' 
                      : 'bg-gray-100 border border-gray-300 text-black focus:border-orange-500'
                  } focus:outline-none`}
                />
              </div>

              <div className="mb-6">
                <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-xl transition-all ${
                    darkMode 
                      ? 'bg-zinc-900 border border-zinc-700 text-white focus:border-orange-500' 
                      : 'bg-gray-100 border border-gray-300 text-black focus:border-orange-500'
                  } focus:outline-none`}
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all disabled:opacity-50"
              >
                {isLoggingIn ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            {loginMessage && (
              <div className={`mt-4 p-4 rounded-xl text-center text-sm ${
                loginMessage.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/30 text-green-500' 
                  : 'bg-red-500/10 border border-red-500/30 text-red-500'
              }`}>
                {loginMessage.text}
              </div>
            )}
          </div>
        </div>
      )}

      <header className={`fixed top-0 w-full z-30 backdrop-blur-xl ${darkMode ? 'bg-orange-500/80 border-b border-orange-600' : 'bg-white/80 border-b border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div 
            className={`text-xl font-light tracking-wide transition-colors cursor-pointer ${
              darkMode 
                ? hoveredLogo ? 'text-white' : 'text-black'
                : hoveredLogo ? 'text-orange-500' : 'text-black'
            }`}
            onMouseEnter={() => setHoveredLogo(true)}
            onMouseLeave={() => setHoveredLogo(false)}
          >
            SocialGen
          </div>
          <div className="flex items-center gap-8">
            <button
              onClick={() => setDarkMode(!darkMode)}
              onMouseEnter={() => setHoveredTheme(true)}
              onMouseLeave={() => setHoveredTheme(false)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                darkMode 
                  ? hoveredTheme ? 'text-white' : 'text-black'
                  : hoveredTheme ? 'text-orange-500' : 'text-black'
              }`}
            >
              {darkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
            <button 
              onClick={() => setShowLogin(true)}
              onMouseEnter={() => setHoveredLogin(true)}
              onMouseLeave={() => setHoveredLogin(false)}
              className={`text-sm font-medium transition-colors ${
                darkMode 
                  ? hoveredLogin ? 'text-white' : 'text-black'
                  : hoveredLogin ? 'text-orange-500' : 'text-black'
              }`}
            >
              Login
            </button>
          </div>
        </div>
      </header>

      <section className="min-h-screen flex flex-col justify-center items-center text-center px-8 pt-24 relative">
        <h1 className="text-6xl md:text-7xl font-light mb-6 tracking-tight">
          <span className={darkMode ? 'text-black' : 'text-orange-500'}>Create Content That</span><br />
          <span className={`font-normal ${darkMode ? 'text-white' : 'text-black'}`}>Goes Viral</span>
        </h1>
        <p className={`text-lg md:text-xl max-w-2xl mb-12 font-light ${darkMode ? 'text-white' : 'text-black'}`}>
          AI-powered tools to generate stunning social media posts, videos, carousels, presentations, and engagement strategies in seconds
        </p>
      </section>

      <section className="px-8 py-20 relative">
        <h2 className={`text-4xl md:text-5xl font-light text-center mb-4 tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>
          Our Generators
        </h2>
        <p className={`text-lg text-center mb-16 font-light ${darkMode ? 'text-white' : 'text-black'}`}>
          Everything you need to dominate social media
        </p>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {generators.map((gen, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`rounded-2xl p-8 transition-all duration-500 cursor-pointer ${
                visibleItems.includes(idx) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${
                darkMode
                  ? hoveredCard === idx 
                    ? 'bg-orange-500 border-2 border-white' 
                    : 'bg-orange-500 border-2 border-black'
                  : hoveredCard === idx 
                    ? 'bg-gray-50 border-2 border-orange-500' 
                    : 'bg-gray-50 border-2 border-black'
              } ${
                hoveredCard === idx 
                  ? 'scale-105 shadow-2xl'
                  : 'scale-100'
              }`}
              style={{
                transform: hoveredCard === idx ? 'translateY(-8px) scale(1.02)' : 'none'
              }}
            >
              <h3 className={`text-xl font-medium mb-3 transition-colors ${
                darkMode
                  ? hoveredCard === idx ? 'text-white' : 'text-black'
                  : hoveredCard === idx ? 'text-orange-500' : 'text-black'
              }`}>
                {gen.title}
              </h3>
              <p className={`text-sm leading-relaxed font-light ${
                darkMode
                  ? hoveredCard === idx ? 'text-white' : 'text-black'
                  : hoveredCard === idx ? 'text-orange-500' : 'text-black'
              }`}>
                {gen.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}