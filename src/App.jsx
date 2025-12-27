import React, { useState, useEffect } from 'react';
import { Sparkles, Layout, Code, Eye, Save, Download, Menu, X, Send, Plus, Settings, Monitor, Tablet, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { interpretPrompt, generateSite } from './utils/aiEngine';

function App() {
  const [activeTab, setActiveTab] = useState('design'); // 'design' | 'code' | 'preview'
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: 'Hi! I\'m your AI website builder. What kind of website can I help you build today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState('deepseek'); // 'gemini' | 'deepseek'
  const [projectCode, setProjectCode] = useState({
    html: '<h1>Welcome to your new website</h1><p>Start by asking the AI to build something for you.</p>',
    css: 'body { font-family: sans-serif; padding: 20px; } h1 { color: #6366f1; }',
    js: ''
  });

  const handleSendMessage = async (customPrompt = null) => {
    const userPrompt = customPrompt || inputMessage;
    if (!userPrompt.trim() || isLoading) return;

    const userMessage = userPrompt.trim();
    const newMessages = [...messages, { id: Date.now(), role: 'user', content: userMessage }];
    setMessages(newMessages);
    if (!customPrompt) setInputMessage('');
    setIsLoading(true);

    try {
      const result = await generateSite(userMessage, projectCode, provider);

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: result.explanation || "I've updated the website based on your request!"
      }]);

      setProjectCode({
        html: result.html,
        css: result.css,
        js: result.js || ''
      });
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: `Error: ${error.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const [settings, setSettings] = useState({
    primaryColor: '#6366f1',
    fontFamily: 'Inter'
  });

  useEffect(() => {
    // Update the project CSS whenever settings change
    setProjectCode(prev => {
      let css = prev.css;
      // Simple regex replacement for primary color if it's defined as a variable
      if (css.includes('--primary:')) {
        css = css.replace(/--primary:\s*#[a-fA-F0-9]{3,6}/, `--primary: ${settings.primaryColor}`);
      }

      // Update body font-family
      if (css.includes('font-family:')) {
        css = css.replace(/body\s*\{[\s\S]*?font-family:\s*['"]?.*?['"]?/, (match) => {
          return match.replace(/font-family:\s*['"]?.*?['"]?/, `font-family: '${settings.fontFamily}', sans-serif`);
        });
      }

      return { ...prev, css };
    });
  }, [settings]);

  const handleDownload = () => {
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Generated Website</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>${projectCode.css}</style>
</head>
<body>
    ${projectCode.html}
    <script>${projectCode.js}</script>
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-50 overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/10 glass flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Vizion AI</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setActiveTab('design')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'design' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Design
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'code' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Code
            </button>
          </div>

          <div className="h-6 w-px bg-white/10" />

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Monitor size={18} />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'tablet' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Tablet size={18} />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Smartphone size={18} />
            </button>
          </div>

          <div className="h-6 w-px bg-white/10" />

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors font-medium shadow-lg shadow-indigo-600/20"
          >
            <Download size={18} />
            <span>Publish</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - AI Chat */}
        <motion.aside
          initial={false}
          animate={{ width: isSidebarOpen ? 380 : 0 }}
          className="border-r border-white/10 bg-slate-900/50 flex flex-col relative"
        >
          <div className="p-6 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                <Sparkles size={20} className="text-indigo-400" />
                AI Builder
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 border border-white/10 text-slate-200'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isLoading ? "AI is thinking..." : "Ask AI to edit or build..."}
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pr-12 focus:outline-none focus:border-indigo-500/50 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 text-center">
                AI can make mistakes. Check important info.
              </p>
            </div>
          </div>
        </motion.aside>

        {/* Dynamic Resize Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-[380px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-12 bg-indigo-600/10 hover:bg-indigo-600/20 border border-white/10 rounded-full flex items-center justify-center transition-all z-30"
          style={{ left: isSidebarOpen ? '380px' : '0' }}
        >
          {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
        </button>

        {/* Center Canvas */}
        <section className="flex-1 bg-slate-950 p-8 flex flex-col items-center overflow-auto relative">
          <div className="mb-4 flex items-center gap-4 text-xs font-medium text-slate-500">
            <span>PREVIEW</span>
            {viewMode === 'desktop' && <span>1440 x 900</span>}
            {viewMode === 'tablet' && <span>768 x 1024</span>}
            {viewMode === 'mobile' && <span>375 x 667</span>}
          </div>

          <div
            className={`bg-white rounded-xl shadow-2xl transition-all duration-500 overflow-hidden flex-shrink-0 ${viewMode === 'desktop' ? 'w-full h-full' :
              viewMode === 'tablet' ? 'w-[768px] h-[1024px]' :
                'w-[375px] h-[667px]'
              }`}
          >
            {activeTab === 'design' ? (
              <iframe
                title="Preview"
                className="w-full h-full border-none"
                srcDoc={`
                  <html>
                    <head>
                      <link rel="preconnect" href="https://fonts.googleapis.com">
                      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
                      <style>${projectCode.css}</style>
                    </head>
                    <body>${projectCode.html}</body>
                  </html>
                `}
              />
            ) : (
              <div className="w-full h-full bg-[#1e1e1e] p-4 font-mono text-sm overflow-auto text-indigo-300 relative group">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${projectCode.html}\n\n<style>\n${projectCode.css}\n</style>`);
                    alert('Code copied to clipboard!');
                  }}
                  className="absolute top-4 right-4 p-2 bg-indigo-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Code size={18} className="text-white" />
                </button>
                <div className="mb-4">
                  <div className="text-slate-500 mb-2">// index.html</div>
                  <pre>{projectCode.html}</pre>
                </div>
                <div>
                  <div className="text-slate-500 mb-2">// styles.css</div>
                  <pre>{projectCode.css}</pre>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Sidebar - Component Library */}
        <aside className="w-80 border-l border-white/10 bg-slate-900/50 flex flex-col">
          <div className="p-6">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2 mb-6">
              <Layout size={20} className="text-indigo-400" />
              Components
            </h2>

            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Basics</span>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => handleSendMessage('Add a modern header section to the top.')}
                    className="aspect-square bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center p-4 hover:border-indigo-500/50 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <Layout className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 mb-2" />
                    <span className="text-[11px] font-medium">Header</span>
                  </div>
                  <div
                    onClick={() => handleSendMessage('Add a bold hero section with a call to action.')}
                    className="aspect-square bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center p-4 hover:border-indigo-500/50 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <Monitor className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 mb-2" />
                    <span className="text-[11px] font-medium">Hero</span>
                  </div>
                  <div
                    onClick={() => handleSendMessage('Add a features grid section.')}
                    className="aspect-square bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center p-4 hover:border-indigo-500/50 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <Menu className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 mb-2" />
                    <span className="text-[11px] font-medium">Features</span>
                  </div>
                  <div
                    onClick={() => handleSendMessage('Add a professional footer section.')}
                    className="aspect-square bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center p-4 hover:border-indigo-500/50 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <Plus className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 mb-2" />
                    <span className="text-[11px] font-medium">Footer</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Settings</span>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-400">AI Provider</label>
                    <div className="flex bg-slate-900/50 p-1 rounded-lg border border-white/5">
                      <button
                        onClick={() => setProvider('gemini')}
                        className={`flex-1 px-2 py-1.5 rounded-md text-[10px] font-bold transition-all ${provider === 'gemini' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}
                      >
                        GEMINI
                      </button>
                      <button
                        onClick={() => setProvider('deepseek')}
                        className={`flex-1 px-2 py-1.5 rounded-md text-[10px] font-bold transition-all ${provider === 'deepseek' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}
                      >
                        DEEPSEEK
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-400">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                      />
                      <span className="text-xs font-mono lowercase">{settings.primaryColor}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-400">Font Family</label>
                    <select
                      value={settings.fontFamily}
                      onChange={(e) => setSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none text-slate-200"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Outfit">Outfit</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Poppins">Poppins</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto p-6 border-t border-white/10">
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 transition-all">
              <Settings size={18} className="text-slate-400" />
              <span className="text-sm font-medium">Project Settings</span>
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
