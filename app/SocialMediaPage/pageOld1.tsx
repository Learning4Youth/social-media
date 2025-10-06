"use client";

import React, { useState, useEffect } from 'react';

export default function MembersPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Main text input
  const [Text_, setText_] = useState('');
  
  // Boolean checkboxes
  const [X_Post_Checked, setX_Post_Checked] = useState(false);
  const [Instagram_Post_Checked, setInstagram_Post_Checked] = useState(false);
  const [TikTok_Post_Checked, setTikTok_Post_Checked] = useState(false);
  const [LinkedIn_Post_Checked, setLinkedIn_Post_Checked] = useState(false);
  const [Facebook_Post_Checked, setFacebook_Post_Checked] = useState(false);
  const [Presentation_Checked, setPresentation_Checked] = useState(false);
  const [Quiz_Checked, setQuiz_Checked] = useState(false);
  const [Engagement_Strategies_Checked, setEngagement_Strategies_Checked] = useState(false);
  const [AI_Image_Checked, setAI_Image_Checked] = useState(false);
  const [Short_Video_Checked, setShort_Video_Checked] = useState(false);
  const [Long_Video_Checked, setLong_Video_Checked] = useState(false);
  const [Lyrics_Songs_Checked, setLyrics_Songs_Checked] = useState(false);
  
  // Conditional fields
  const [Quiz_Type, setQuiz_Type] = useState('Multiple Choice');
  const [Number_of_Questions, setNumber_of_Questions] = useState(10);
  const [Genre_, setGenre_] = useState('');
  const [Must_Have_Words, setMust_Have_Words] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoveredTheme, setHoveredTheme] = useState(false);
  const [hoveredLogout, setHoveredLogout] = useState(false);
  const [hoveredLogo, setHoveredLogo] = useState(false);

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || !userData) {
      const mockUser = {
        'Name Surname': 'Demo User',
        'e-mail': 'demo@socialgen.com'
      };
      setUser(mockUser);
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  const handleNumberChange = (value: string) => {
    const num = parseInt(value);
    if (num >= 5 && num <= 20) {
      setNumber_of_Questions(num);
    } else if (value === '') {
      setNumber_of_Questions(5);
    }
  };

  const handleGenerate = async () => {
    if (!Text_.trim()) {
      alert('Please enter text');
      return;
    }

    const hasSelection = X_Post_Checked || Instagram_Post_Checked || TikTok_Post_Checked || 
                        LinkedIn_Post_Checked || Facebook_Post_Checked || Presentation_Checked ||
                        Quiz_Checked || Engagement_Strategies_Checked || AI_Image_Checked ||
                        Short_Video_Checked || Long_Video_Checked || Lyrics_Songs_Checked;

    if (!hasSelection) {
      alert('Please select at least one option');
      return;
    }

    setIsProcessing(true);

    const payload = {
      Text_,
      X_Post_Checked,
      Instagram_Post_Checked,
      TikTok_Post_Checked,
      LinkedIn_Post_Checked,
      Facebook_Post_Checked,
      Presentation_Checked,
      Quiz_Checked,
      ...(Quiz_Checked && { Quiz_Type, Number_of_Questions }),
      Engagement_Strategies_Checked,
      AI_Image_Checked,
      Short_Video_Checked,
      Long_Video_Checked,
      Lyrics_Songs_Checked,
      ...(Lyrics_Songs_Checked && { Genre_, Must_Have_Words })
    };

    console.log('Sending to n8n:', payload);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    alert('Content generated successfully!');
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${darkMode ? 'bg-orange-500' : 'bg-gray-50'}`}>
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
            onClick={() => window.location.href = '/'}
          >
            SocialGen
          </div>
          <div className="flex items-center gap-8">
            <span className={`text-sm ${darkMode ? 'text-black' : 'text-black'}`}>
              Welcome, {user?.['Name Surname'] || 'User'}
            </span>
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
              onClick={handleLogout}
              onMouseEnter={() => setHoveredLogout(true)}
              onMouseLeave={() => setHoveredLogout(false)}
              className={`text-sm font-medium transition-colors ${
                darkMode 
                  ? hoveredLogout ? 'text-white' : 'text-black'
                  : hoveredLogout ? 'text-orange-500' : 'text-black'
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="pt-32 px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-5xl font-light mb-12 tracking-tight ${darkMode ? 'text-black' : 'text-black'}`}>
            Content Generator
          </h1>

          <div className={`rounded-2xl p-8 mb-8 border-2 ${darkMode ? 'bg-orange-500 border-black' : 'bg-white border-black'}`}>
            <textarea
              value={Text_}
              onChange={(e) => setText_(e.target.value)}
              placeholder="Enter your content idea..."
              rows={4}
              className={`w-full px-4 py-3 rounded-xl transition-all resize-none border-2 ${
                darkMode 
                  ? `bg-orange-400 ${Text_.trim() ? 'border-white text-white' : 'border-black text-black'} focus:border-white focus:text-white placeholder-gray-600` 
                  : 'bg-white border-black text-black focus:border-orange-500 placeholder-gray-400'
              } focus:outline-none`}
            />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <label className={`flex items-center gap-2 p-4 rounded-xl cursor-pointer transition-all border-2 ${
              X_Post_Checked
                ? darkMode ? 'bg-orange-500 border-white' : 'bg-orange-50 border-orange-500'
                : darkMode ? 'bg-orange-500 border-black hover:border-zinc-500' : 'bg-white border-black hover:border-orange-500'
            }`}>
              <input
                type="checkbox"
                checked={X_Post_Checked}
                onChange={(e) => setX_Post_Checked(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-500"
              />
              <span className={`text-sm ${darkMode ? (X_Post_Checked ? 'text-white' : 'text-black') : 'text-black'}`}>X Post</span>
            </label>

            <label className={`flex items-center gap-2 p-4 rounded-xl cursor-pointer transition-all border-2 ${
              Instagram_Post_Checked
                ? darkMode ? 'bg-orange-500 border-white' : 'bg-orange-50 border-orange-500'
                : darkMode ? 'bg-orange-500 border-black hover:border-zinc-500' : 'bg-white border-black hover:border-orange-500'
            }`}>
              <input
                type="checkbox"
                checked={Instagram_Post_Checked}
                onChange={(e) => setInstagram_Post_Checked(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-500"
              />
              <span className={`text-sm ${darkMode ? (Instagram_Post_Checked ? 'text-white' : 'text-black') : 'text-black'}`}>Instagram Post</span>
            </label>

            <label className={`flex items-center gap-2 p-4 rounded-xl cursor-pointer transition-all border-2 ${
              TikTok_Post_Checked
                ? darkMode ? 'bg-orange-500 border-white' : 'bg-orange-50 border-orange-500'
                : darkMode ? 'bg-orange-500 border-black hover:border-zinc-500' : 'bg-white border-black hover:border-orange-500'
            }`}>
              <input
                type="checkbox"
                checked={TikTok_Post_Checked}
                onChange={(e) => setTikTok_Post_Checked(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-500"
              />
              <span className={`text-sm ${darkMode ? (TikTok_Post_Checked ? 'text-white' : 'text-black') : 'text-black'}`}>TikTok Post</span>
            </label>

            <label className={`flex items-center gap-2 p-4 rounded-xl cursor-pointer transition-all border-2 ${
              LinkedIn_Post_Checked
                ? darkMode ? 'bg-orange-500 border-white' : 'bg-orange-50 border-orange-500'
                : darkMode ? 'bg-orange-500 border-black hover:border-zinc-500' : 'bg-white border-black hover:border-orange-500'
            }`}>
              <input
                type="checkbox"
                checked={LinkedIn_Post_Checked}
                onChange={(e) => setLinkedIn_Post_Checked(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-500"
              />
              <span className={`text-sm ${darkMode ? (LinkedIn_Post_Checked ? 'text-white' : 'text-black') : 'text-black'}`}>LinkedIn Post</span>
            </label>

            <label className={`flex items-center gap-2 p-4 rounded-xl cursor-pointer transition-all border-2 ${
              Facebook_Post_Checked
                ? darkMode ? 'bg-orange-500 border-white' : 'bg-orange-50 border-orange-500'
                : darkMode ? 'bg-orange-500 border-black hover:border-zinc-500' : 'bg-white border-black hover:border-orange-500'
            }`}>
              <input
                type="checkbox"
                checked={Facebook_Post_Checked}
                onChange={(e) => setFacebook_Post_Checked(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-500"
              />
              <span className={`text-sm ${darkMode ? (Facebook_Post_Checked ? 'text-white' : 'text-black') : 'text-black'}`}>Facebook Post</span>
            </label>

            <label className={`flex items-center gap-2 p-4 rounded-xl cursor-pointer transition-all border-2 ${
              Presentation_Checked
                ? darkMode ? 'bg-orange-500 border-white' : 'bg-orange-50 border-orange-500'
                : darkMode ? 'bg-orange-500 border-black hover:border-zinc-500' : 'bg-white border-black hover:border-orange-500'
            }`}>
              <input
                type="checkbox"
                checked={Presentation_Checked}
                onChange={(e) => setPresentation_Checked(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-500"
              />
              <span className={`text-sm ${darkMode ? (Presentation_Checked ? 'text-white' : 'text-black') : 'text-black'}`}>Presentation</span>
            </label>

            <label className={`flex items-center gap-2 p-4 rounded-xl cursor-pointer transition-all border-2 ${
              Quiz_Checked
                ? darkMode ? 'bg-orange-500 border-white' : 'bg-orange-50 border-orange-500'
                : darkMode ? 'bg-orange-500 border-black hover:border-zinc-500' : 'bg-white border-black hover:border-orange-500'
            }`}>
              <input
                type="checkbox"
                checked={Quiz_Checked}
                onChange={(e) => setQuiz_Checked(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-500"
              />
              <span className={`text-sm ${darkMode ? (Quiz_Checked ? 'text-white' : 'text-black') : 'text-black'}`}>Quiz</span>
            </label>

            <label className={`flex items-center gap-2 p-4 rounded-xl cursor-pointer transition-all border-2 ${
              Engagement_Strategies_Checked
                ? darkMode ? 'bg-orange-500 border-white' : 'bg-orange-50 border-orange-500'
                : darkMode ? 'bg-orange-500 border-black hover:border-zinc-500' : 'bg-white border-black hover:border-orange-500'
            }`}>
              <input
                type="checkbox"
                checked={Engagement_Strategies_Checked}
                onChange={(e) => setEngagement_Strategies_Checked(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-500"
              />
              <span className={`text-sm ${darkMode ? (Engagement_Strategies_Checked ? 'text-white' : 'text-black') : 'text-black'}`}>Engagement Strategies</span>
            </label>

            <label className={`flex items-center gap-2 p-4 rounded-xl cursor-pointer transition-all border-2 ${
              AI_Image_Checked
                ? darkMode ? 'bg-orange-500 border-white' : 'bg-orange-50 border-orange-500'
                : darkMode ? 'bg-orange-500 border-black hover:border-zinc-500' : 'bg-white border-black hover:border-orange-500'
            }`}>
              <input
                type="checkbox"
                checked={AI_Image_Checked}
                onChange={(e) => setAI_Image_Checked(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-500"
              />
              <span className={`text-sm ${darkMode ? (AI_Image_Checked ? 'text-white' : 'text-black') : 'text-black'}`}>AI Image</span>
            </label>

            <label className={`flex items-center gap-2 p-4 rounded-xl cursor-pointer transition-all border-2 ${
              Short_Video_Checked
                ? darkMode ? 'bg-orange-500 border-white' : 'bg-orange-50 border-orange-500'
                : darkMode ? 'bg-orange-500 border-black hover:border-zinc-500' : 'bg-white border-black hover:border-orange-500'
            }`}>
              <input
                type="checkbox"
                checked={Short_Video_Checked}
                onChange={(e) => setShort_Video_Checked(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-500"
              />
              <span className={`text-sm ${darkMode ? (Short_Video_Checked ? 'text-white' : 'text-black') : 'text-black'}`}>Short Video Script</span>
            </label>

            <label className={`flex items-center gap-2 p-4 rounded-xl cursor-pointer transition-all border-2 ${
              Long_Video_Checked
                ? darkMode ? 'bg-orange-500 border-white' : 'bg-orange-50 border-orange-500'
                : darkMode ? 'bg-orange-500 border-black hover:border-zinc-500' : 'bg-white border-black hover:border-orange-500'
            }`}>
              <input
                type="checkbox"
                checked={Long_Video_Checked}
                onChange={(e) => setLong_Video_Checked(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-500"
              />
              <span className={`text-sm ${darkMode ? (Long_Video_Checked ? 'text-white' : 'text-black') : 'text-black'}`}>Long Video Script</span>
            </label>

            <label className={`flex items-center gap-2 p-4 rounded-xl cursor-pointer transition-all border-2 ${
              Lyrics_Songs_Checked
                ? darkMode ? 'bg-orange-500 border-white' : 'bg-orange-50 border-orange-500'
                : darkMode ? 'bg-orange-500 border-black hover:border-zinc-500' : 'bg-white border-black hover:border-orange-500'
            }`}>
              <input
                type="checkbox"
                checked={Lyrics_Songs_Checked}
                onChange={(e) => setLyrics_Songs_Checked(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-500"
              />
              <span className={`text-sm ${darkMode ? (Lyrics_Songs_Checked ? 'text-white' : 'text-black') : 'text-black'}`}>Lyrics and Songs</span>
            </label>
          </div>

          {Quiz_Checked && (
            <div className={`rounded-2xl p-6 mb-8 border-2 ${darkMode ? 'bg-orange-500 border-black' : 'bg-white border-black'}`}>
              <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-black' : 'text-black'}`}>Quiz Options</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm ${darkMode ? 'text-black' : 'text-gray-700'}`}>Quiz Type</label>
                  <select
                    value={Quiz_Type}
                    onChange={(e) => setQuiz_Type(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl transition-all border-2 ${
                      darkMode 
                        ? `bg-orange-400 ${Quiz_Type ? 'border-white text-white' : 'border-black text-black'} focus:border-white focus:text-white` 
                        : 'bg-white border-black text-black focus:border-orange-500'
                    } focus:outline-none`}
                  >
                    <option>Multiple Choice</option>
                    <option>Open Ended</option>
                  </select>
                </div>
                <div>
                  <label className={`block mb-2 text-sm ${darkMode ? 'text-black' : 'text-gray-700'}`}>Number of Questions (5-20)</label>
                  <input
                    type="number"
                    min="5"
                    max="20"
                    value={Number_of_Questions}
                    onChange={(e) => handleNumberChange(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl transition-all border-2 ${
                      darkMode 
                        ? `bg-orange-400 ${Number_of_Questions ? 'border-white text-white' : 'border-black text-black'} focus:border-white focus:text-white` 
                        : 'bg-white border-black text-black focus:border-orange-500'
                    } focus:outline-none`}
                  />
                </div>
              </div>
            </div>
          )}

          {Lyrics_Songs_Checked && (
            <div className={`rounded-2xl p-6 mb-8 border-2 ${darkMode ? 'bg-orange-500 border-black' : 'bg-white border-black'}`}>
              <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-black' : 'text-black'}`}>Lyrics Options</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm ${darkMode ? 'text-black' : 'text-gray-700'}`}>Genre</label>
                  <input
                    type="text"
                    value={Genre_}
                    onChange={(e) => setGenre_(e.target.value)}
                    placeholder="e.g., Pop, Rock, Hip-hop"
                    className={`w-full px-4 py-3 rounded-xl transition-all border-2 ${
                      darkMode 
                        ? `bg-orange-400 ${Genre_.trim() ? 'border-white text-white' : 'border-black text-black'} focus:border-white focus:text-white placeholder-gray-600` 
                        : 'bg-white border-black text-black focus:border-orange-500 placeholder-gray-400'
                    } focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block mb-2 text-sm ${darkMode ? 'text-black' : 'text-gray-700'}`}>Must Have Words</label>
                  <input
                    type="text"
                    value={Must_Have_Words}
                    onChange={(e) => setMust_Have_Words(e.target.value)}
                    placeholder="e.g., love, dream, freedom"
                    className={`w-full px-4 py-3 rounded-xl transition-all border-2 ${
                      darkMode 
                        ? `bg-orange-400 ${Must_Have_Words.trim() ? 'border-white text-white' : 'border-black text-black'} focus:border-white focus:text-white placeholder-gray-600` 
                        : 'bg-white border-black text-black focus:border-orange-500 placeholder-gray-400'
                    } focus:outline-none`}
                  />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isProcessing || !Text_.trim()}
            className={`w-full py-4 rounded-xl font-medium transition-all ${
              darkMode
                ? 'bg-black text-white hover:bg-zinc-800'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isProcessing ? 'Generating...' : 'Generate Content'}
          </button>
        </div>
      </div>
    </div>
  );
}