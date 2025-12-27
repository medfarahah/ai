import React, { useState } from 'react';
import { Sparkles, ArrowRight, ChevronDown, Search, Paperclip, MessageSquare, Mic, ArrowUp, Layout, Globe, Smartphone, Heart, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function LovableLanding() {
    const [inputMessage, setInputMessage] = useState('');

    const templates = [
        {
            title: "Ecommerce store",
            description: "Premium design for webstore",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60",
            tag: "Store"
        },
        {
            title: "Architect portfolio",
            description: "Firm website & showcase",
            image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&auto=format&fit=crop&q=60",
            tag: "Portfolio"
        },
        {
            title: "Personal blog",
            description: "Muted, intimate design",
            image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60",
            tag: "Blog"
        },
        {
            title: "Fashion blog",
            description: "Minimal, playful design",
            image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=60",
            tag: "Fashion"
        }
    ];

    return (
        <div className="relative min-h-screen">
            <div className="lovable-bg" />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                                    <Heart className="w-5 h-5 text-white fill-current" />
                                </div>
                                <span className="text-display font-bold text-xl tracking-tight text-slate-900">Lovable</span>
                            </div>

                            <div className="hidden md:flex items-center gap-6">
                                <button className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1">
                                    Solutions <ChevronDown size={14} />
                                </button>
                                <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Enterprise</button>
                                <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Pricing</button>
                                <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Community</button>
                                <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Discover</button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="text-sm font-semibold text-slate-900 px-4 py-2 hover:bg-slate-50 rounded-full transition-colors">Log in</button>
                            <button className="btn-premium btn-primary-lovable text-sm">Get started</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-4">
                {/* Banner */}
                <div className="flex justify-center mb-12">
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-white/50 border border-white/80 rounded-full text-[13px] font-medium text-slate-600 hover:bg-white/80 transition-all shadow-sm">
                        <span className="flex items-center justify-center w-5 h-3 overflow-hidden rounded-[2px]">
                            <div className="w-full h-1/2 bg-[#FFD700]"></div>
                            <div className="w-full h-1/2 bg-[#0057B7]"></div>
                        </span>
                        Buy a Lovable gift card
                        <ArrowRight size={14} className="text-slate-400" />
                    </button>
                </div>

                {/* Hero Content */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-display text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Build something <span className="inline-flex items-center gap-2">
                            <Heart className="w-8 h-8 text-pink-500 fill-current" /> Lovable
                        </span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium">
                        Create apps and websites by chatting with AI
                    </p>
                </div>

                {/* Central Search Bar */}
                <div className="search-container mb-24">
                    <div className="glass-card rounded-[2rem] p-4 flex flex-col gap-4">
                        <div className="px-4 pt-2">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Ask Lovable to create a prototype for you..."
                                className="w-full bg-transparent text-lg text-slate-800 placeholder-slate-400 focus:outline-none resize-none h-12"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
                                    <Plus size={20} />
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 text-sm font-medium">
                                    <Paperclip size={18} />
                                    Attach
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 text-sm font-medium">
                                    <Layout size={18} />
                                    Theme
                                    <ChevronDown size={14} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 text-sm font-medium">
                                    <MessageSquare size={18} />
                                    Chat
                                </button>
                                <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
                                    <Mic size={18} />
                                </button>
                                <button className="w-10 h-10 bg-slate-400 text-white rounded-full flex items-center justify-center hover:bg-slate-900 transition-colors">
                                    <ArrowUp size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Templates Section */}
                <section className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-display text-2xl font-bold text-slate-900">Discover templates</h2>
                            <p className="text-slate-500 font-medium">Start your next project with a template</p>
                        </div>
                        <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900">
                            View all <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {templates.map((template, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-slate-100 shadow-sm border border-slate-200/50">
                                    <img
                                        src={template.image}
                                        alt={template.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg">{template.title}</h3>
                                <p className="text-slate-500 text-sm font-medium">{template.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default LovableLanding;
