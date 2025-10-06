"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface GeneratedResult {
  type: string;
  content: string;
}

export default function MembersPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [Text_, setText_] = useState('');
  
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
  
  const [Quiz_Type, setQuiz_Type] = useState('Multiple Choice');
  const [Number_of_Questions, setNumber_of_Questions] = useState(10);
  const [Genre_, setGenre_] = useState('');
  const [Must_Have_Words, setMust_Have_Words] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = '/';
      return;
    }
    setUser({
      id: session.user.id,
      email: session.user.email,
      name_surname: session.user.email?.split('@')[0] || 'User'
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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
    setResults([]);

    try {
      const mockResults: GeneratedResult[] = [];
      
      if (X_Post_Checked) {
        mockResults.push({
          type: 'X Post',
          content: `🚀 ${Text_}\n\nExciting developments ahead! Let's make it happen.\n\n#Innovation #Growth #Success`
        });
      }
      
      if (Instagram_Post_Checked) {
        mockResults.push({
          type: 'Instagram Post',
          content: `${Text_}\n\n✨ Swipe to see more! ✨\n\nDouble tap if you agree 💙\n\n#InstaDaily #ContentCreator #DigitalMarketing #SocialMedia #Trending`
        });
      }
      
      if (TikTok_Post_Checked) {
        mockResults.push({
          type: 'TikTok Post',
          content: `${Text_} 🔥\n\nFollow for more! 💯\n\n#TikTok #Viral #Trending #ForYou #FYP`
        });
      }

      if (LinkedIn_Post_Checked) {
        mockResults.push({
          type: 'LinkedIn Post',
          content: `${Text_}\n\nIn today's rapidly evolving landscape, it's crucial to stay ahead of the curve. Here are my thoughts:\n\n• Key insight 1\n• Key insight 2\n• Key insight 3\n\nWhat's your perspective? Let's discuss.\n\n#Leadership #Business #ProfessionalDevelopment`
        });
      }

      if (Facebook_Post_Checked) {
        mockResults.push({
          type: 'Facebook Post',
          content: `${Text_}\n\nWhat do you think? Share your thoughts in the comments below! 👇\n\n#Facebook #Community #Engagement`
        });
      }

      if (Presentation_Checked) {
        mockResults.push({
          type: 'Presentation Outline',
          content: `Presentation: ${Text_}\n\nSlide 1: Title\n- ${Text_}\n\nSlide 2: Introduction\n- Context and background\n- Why this matters\n\nSlide 3-5: Main Points\n- Key insight 1\n- Key insight 2\n- Key insight 3\n\nSlide 6: Conclusion\n- Summary\n- Call to action`
        });
      }

      if (Quiz_Checked) {
        mockResults.push({
          type: `Quiz (${Quiz_Type})`,
          content: `Quiz about: ${Text_}\n\nType: ${Quiz_Type}\nQuestions: ${Number_of_Questions}\n\n1. Question 1 about ${Text_}?\n${Quiz_Type === 'Multiple Choice' ? 'A) Option 1\nB) Option 2\nC) Option 3\nD) Option 4' : 'Open-ended answer'}\n\n2. Question 2...\n\n[${Number_of_Questions} questions generated]`
        });
      }

      if (Engagement_Strategies_Checked) {
        mockResults.push({
          type: 'Engagement Strategies',
          content: `Engagement Strategies for: ${Text_}\n\n1. Post during peak hours (9AM-11AM, 7PM-9PM)\n2. Use relevant hashtags\n3. Create polls and questions\n4. Share behind-the-scenes content\n5. Engage with comments within first hour\n6. Cross-post to multiple platforms\n7. Use visual content (images/videos)`
        });
      }

      if (AI_Image_Checked) {
        mockResults.push({
          type: 'AI Image Prompt (Midjourney)',
          content: `/imagine ${Text_}, professional photography, studio lighting, vibrant colors, high detail, sharp focus, 8k resolution, award-winning composition --ar 16:9 --v 6 --style raw`
        });
      }

      if (Short_Video_Checked) {
        mockResults.push({
          type: 'Short Video Script (30-60s)',
          content: `Short Video Script: ${Text_}\n\nHook (0-3s):\n"Wait, did you know..."\n\nMain Content (3-45s):\n${Text_}\n\nCall to Action (45-60s):\n"Follow for more! Comment below!"\n\nVisual Notes:\n- Fast cuts every 3-5 seconds\n- Bold text overlays\n- Trending audio`
        });
      }

      if (Long_Video_Checked) {
        mockResults.push({
          type: 'Long Video Script (5-10min)',
          content: `Long Video Script: ${Text_}\n\nIntro (0:00-0:30)\n- Hook\n- Channel intro\n- What we'll cover\n\nSection 1 (0:30-3:00)\n- Main point 1 about ${Text_}\n\nSection 2 (3:00-6:00)\n- Main point 2\n\nSection 3 (6:00-8:30)\n- Main point 3\n\nConclusion (8:30-10:00)\n- Recap\n- CTA\n- Next video teaser`
        });
      }

      if (Lyrics_Songs_Checked) {
        mockResults.push({
          type: `Song Lyrics (${Genre_ || 'General'})`,
          content: `Song about: ${Text_}\nGenre: ${Genre_ || 'General'}\n${Must_Have_Words ? `Must include: ${Must_Have_Words}\n` : ''}\n\nVerse 1:\n[Lyrics about ${Text_}]\n${Must_Have_Words ? `Including: ${Must_Have_Words}` : ''}\n\nChorus:\n[Catchy hook]\n\nVerse 2:\n[Continues theme]\n\nChorus:\n[Repeat]\n\nBridge:\n[Emotional peak]\n\nChorus:\n[Final]`
        });
      }

      setResults(mockResults);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-500">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-700 ${darkMode ? 'bg-orange-500' : 'bg-gray-50'}`}>
      <header className={`fixed top-0 w-full z-30 backdrop-blur-xl ${darkMode ? 'bg-orange-500/80 border-b border-orange-600' : 'bg-white/80 border-b border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="text-xl font-light tracking-wide text-black cursor-pointer" onClick={() => window.location.href = '/'}>
            SocialGen
          </div>
          <div className="flex items-center gap-8">
            <span className="text-sm text-black">Welcome, {user?.name_surname || 'User'}</span>
            <button onClick={() => setDarkMode(!darkMode)} className="w-10 h-10 rounded-full flex items-center justify-center text-black hover:text-white">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={handleLogout} className="text-sm font-medium text-black hover:text-white">
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
                  ? 'bg-orange-400 border-black text-black placeholder-gray-600 focus:border-white focus:text-white' 
                  : 'bg-white border-black text-black focus:border-orange-500 placeholder-gray-400'
              } focus:outline-none`}
            />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { state: X_Post_Checked, setState: setX_Post_Checked, label: 'X Post' },
              { state: Instagram_Post_Checked, setState: setInstagram_Post_Checked, label: 'Instagram Post' },
              { state: TikTok_Post_Checked, setState: setTikTok_Post_Checked, label: 'TikTok Post' },
              { state: LinkedIn_Post_Checked, setState: setLinkedIn_Post_Checked, label: 'LinkedIn Post' },
              { state: Facebook_Post_Checked, setState: setFacebook_Post_Checked, label: 'Facebook Post' },
              { state: Presentation_Checked, setState: setPresentation_Checked, label: 'Presentation' },
              { state: Quiz_Checked, setState: setQuiz_Checked, label: 'Quiz' },
              { state: Engagement_Strategies_Checked, setState: setEngagement_Strategies_Checked, label: 'Engagement Strategies' },
              { state: AI_Image_Checked, setState: setAI_Image_Checked, label: 'AI Image' },
              { state: Short_Video_Checked, setState: setShort_Video_Checked, label: 'Short Video Script' },
              { state: Long_Video_Checked, setState: setLong_Video_Checked, label: 'Long Video Script' },
              { state: Lyrics_Songs_Checked, setState: setLyrics_Songs_Checked, label: 'Lyrics and Songs' },
            ].map((checkbox, idx) => (
              <label key={idx} className={`flex items-center gap-2 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                checkbox.state
                  ? darkMode ? 'bg-orange-500 border-white' : 'bg-orange-50 border-orange-500'
                  : darkMode ? 'bg-orange-500 border-black hover:border-zinc-500' : 'bg-white border-black hover:border-orange-500'
              }`}>
                <input
                  type="checkbox"
                  checked={checkbox.state}
                  onChange={(e) => checkbox.setState(e.target.checked)}
                  className="w-4 h-4 rounded accent-orange-500"
                />
                <span className={`text-sm ${darkMode ? (checkbox.state ? 'text-white' : 'text-black') : 'text-black'}`}>{checkbox.label}</span>
              </label>
            ))}
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
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      darkMode ? 'bg-orange-400 border-white text-white' : 'bg-white border-black text-black'
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
                    onChange={(e) => setNumber_of_Questions(parseInt(e.target.value))}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      darkMode ? 'bg-orange-400 border-white text-white' : 'bg-white border-black text-black'
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
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      darkMode ? 'bg-orange-400 border-black text-black placeholder-gray-600' : 'bg-white border-black text-black'
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
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      darkMode ? 'bg-orange-400 border-black text-black placeholder-gray-600' : 'bg-white border-black text-black'
                    } focus:outline-none`}
                  />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isProcessing || !Text_.trim()}
            className={`w-full py-4 rounded-xl font-medium transition-all mb-8 ${
              darkMode ? 'bg-black text-white hover:bg-zinc-800' : 'bg-orange-500 text-white hover:bg-orange-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isProcessing ? 'Generating...' : 'Generate Content'}
          </button>

          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className={`text-3xl font-light mb-6 ${darkMode ? 'text-black' : 'text-black'}`}>
                Generated Content
              </h2>
              
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-6 border-2 ${
                    darkMode ? 'bg-orange-500 border-black' : 'bg-white border-black'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-black' : 'text-black'}`}>
                      {result.type}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(result.content, index)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        copiedIndex === index
                          ? darkMode ? 'bg-white text-black' : 'bg-orange-500 text-white'
                          : darkMode ? 'bg-black text-white hover:bg-zinc-800' : 'bg-gray-200 text-black hover:bg-gray-300'
                      }`}
                    >
                      {copiedIndex === index ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                  
                  <div
                    className={`p-4 rounded-xl border-2 whitespace-pre-wrap ${
                      darkMode ? 'bg-orange-400 border-black text-black' : 'bg-gray-50 border-gray-200 text-black'
                    }`}
                  >
                    {result.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}