"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [hoveredTheme, setHoveredTheme] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
      setIsLoading(false);
      return;
    }

    console.log('Login successful!');
    window.location.href = '/HomePage';
  } catch (err) {
    console.error('Catch error:', err);
    setError('Login failed');
    setIsLoading(false);
  }
};

  return (
    <div className={`min-h-screen transition-colors duration-700 ${darkMode ? 'bg-orange-500' : 'bg-gray-50'} flex items-center justify-center`}>
      <div className="absolute top-8 right-8">
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
      </div>

      <div className="w-full max-w-md px-8">
        <div className="text-center mb-12">
          <h1 className={`text-6xl font-light mb-4 tracking-tight ${darkMode ? 'text-black' : 'text-black'}`}>
            SocialGen
          </h1>
          <p className={`text-lg ${darkMode ? 'text-black' : 'text-gray-600'}`}>
            AI-Powered Content Generator
          </p>
        </div>

        <div className={`rounded-2xl p-8 border-2 ${darkMode ? 'bg-orange-500 border-black' : 'bg-white border-black'}`}>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@company.com"
                className={`w-full px-4 py-3 rounded-xl transition-all border-2 ${
                  darkMode 
                    ? `bg-orange-400 ${email.trim() ? 'border-white text-white' : 'border-black text-black'} focus:border-white focus:text-white placeholder-gray-600` 
                    : 'bg-white border-black text-black focus:border-orange-500 placeholder-gray-400'
                } focus:outline-none`}
              />
            </div>

            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl transition-all border-2 ${
                  darkMode 
                    ? `bg-orange-400 ${password ? 'border-white text-white' : 'border-black text-black'} focus:border-white focus:text-white placeholder-gray-600` 
                    : 'bg-white border-black text-black focus:border-orange-500 placeholder-gray-400'
                } focus:outline-none`}
              />
            </div>

            {error && (
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-red-500/20 text-red-900' : 'bg-red-50 text-red-600'} text-sm`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-medium transition-all ${
                darkMode
                  ? 'bg-black text-white hover:bg-zinc-800'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className={`mt-6 text-center text-sm ${darkMode ? 'text-black' : 'text-gray-600'}`}>
            Team members only • Contact admin for access
          </div>
        </div>
      </div>
    </div>
  );
}