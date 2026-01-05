import React, { useEffect, useState } from 'react';
import { Play, TrendingUp, CheckCircle, ArrowRight, DollarSign, Clock, FileText, Lock, Heart, HelpCircle, ChevronRight, Activity, Zap, Shield, Users } from 'lucide-react';
import { Footer } from '../components/Footer';

/**
 * ATLAS THEME LANDING PAGE - PREMIUM EDITION
 * Redesigned to match the "Scale from Operator to Owner" aesthetic with advanced animations.
 */

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logos = [
    "Inc42", "The Write Life", "Lifehack", "Inc.", "TechCrunch", "Social Media Examiner",
    "Inc42", "The Write Life", "Lifehack", "Inc.", "TechCrunch", "Social Media Examiner"
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased overflow-x-hidden selection:bg-[#FF8C42] selection:text-white font-sans">

      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#050505]/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rotate-45 bg-[#FF8C42] rounded-[6px] flex items-center justify-center shadow-[0_0_15px_rgba(255,140,66,0.3)]">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">LinkMag</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <a href="#" className="text-sm font-medium text-[#888888] hover:text-white transition-colors">Home</a>
            <a href="#about" className="text-sm font-medium text-[#888888] hover:text-white transition-colors">About</a>
            <a href="#features" className="text-sm font-medium text-[#888888] hover:text-white transition-colors">Features</a>
            <a href="#results" className="text-sm font-medium text-[#888888] hover:text-white transition-colors">Results</a>
            <a href="#how-it-works" className="text-sm font-medium text-[#888888] hover:text-white transition-colors">How it Works</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="/login" className="hidden md:block text-xs font-medium text-white/60 hover:text-white uppercase tracking-wider">Login</a>
            <a href="/signup" className="bg-[#1A1A1A] hover:bg-[#252525] border border-white/10 text-white text-xs font-medium tracking-wide px-5 py-2.5 rounded-full transition-all duration-300 uppercase hover:border-[#FF8C42]/50 hover:shadow-[0_0_20px_rgba(255,140,66,0.1)]">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* --- HERO SECTION --- */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">

          {/* ANIMATED GOLDEN CIRCLE */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[1000px] md:h-[1000px] pointer-events-none z-0">
            {/* Base Ring - Thin and Elegant */}
            <div className="absolute inset-0 rounded-full border-[0.5px] border-white/10"></div>

            {/* Rotating Golden Arc - Slow & Premium */}
            <div className="absolute inset-0 animate-spin [animation-duration:60s]">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* The Glow Shadow/Trail Layer - Longer & blurrier */}
                <circle cx="50" cy="50" r="49.8" fill="none" stroke="#FF8C42" strokeWidth="0.15" strokeDasharray="40 270" strokeLinecap="round" className="opacity-30 blur-md" />
                {/* The Glow Shadow/Trail Layer - Closer */}
                <circle cx="50" cy="50" r="49.8" fill="none" stroke="#FF8C42" strokeWidth="0.15" strokeDasharray="30 280" strokeLinecap="round" className="opacity-50 blur-sm" />
                {/* The Sharp Main Line - Short & Bright */}
                <circle cx="50" cy="50" r="49.8" fill="none" stroke="#FF8C42" strokeWidth="0.15" strokeDasharray="20 290" strokeLinecap="round" className="drop-shadow-[0_0_15px_rgba(255,140,66,1)]" />
              </svg>
            </div>
          </div>

          {/* Inner Subtle Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[750px] md:h-[750px] rounded-full border border-white/5 pointer-events-none z-0"></div>

          {/* Grid Background */}
          <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] opacity-20"></div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full relative z-10">

            {/* Left Content */}
            <div className="space-y-10 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF8C42]/30 bg-[#FF8C42]/5 shadow-[0_0_10px_rgba(255,140,66,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C42] animate-pulse"></span>
                <span className="text-[10px] font-mono font-medium tracking-widest text-[#FF8C42] uppercase">Trusted by 5,000+ Publishers</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-[76px] leading-[1.05] font-semibold tracking-tighter text-white">
                Unlock Your <br />
                <span className="text-[#FF8C42] inline-block relative">
                  Revenue
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#FF8C42] opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </span> With <br />
                Sponsorships .
              </h1>

              <p className="text-lg text-[#888888] max-w-[480px] leading-relaxed font-light">
                Land brand deals, publish high-quality content, and get paid fast. One systematic platform crafted for serious content businesses.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/signup" className="group relative bg-[#0A0A0A] text-white pl-6 pr-8 py-4 rounded-full text-[15px] font-medium transition-all duration-300 border border-[#333] hover:border-[#FF8C42]/50 hover:shadow-[0_0_20px_rgba(255,140,66,0.2)] overflow-hidden text-center sm:text-left">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF8C42]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center sm:justify-start gap-2">
                    Get Started Free
                  </span>
                </a>

                <a href="#about" className="group flex items-center justify-center sm:justify-start gap-3 px-6 py-4 rounded-full border border-white/10 text-[#888888] hover:text-white hover:border-white/30 transition-all duration-300 hover:bg-white/5">
                  <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center">
                    <Play className="w-2 h-2 fill-current ml-0.5" strokeWidth={0} />
                  </div>
                  <span className="text-[15px] font-medium">About Platform</span>
                </a>
              </div>
            </div>

            {/* Right Content: Dashboard Card */}
            <div className="relative hidden lg:block animate-float">
              <div className="bg-[#080808]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-md ml-auto shadow-[0_20px_50px_-12px_rgba(0,0,0,1)] relative z-20 hover:border-[#FF8C42]/30 transition-colors duration-500">
                {/* Glow Effect */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF8C42]/20 blur-[50px] rounded-full pointer-events-none"></div>

                <div className="flex justify-between items-center mb-10">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#555]">Performance</span>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#333]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#333]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#333]"></div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-[13px] text-[#888888] font-medium">Total Revenue</label>
                      <span className="text-[13px] font-mono text-[#666] border border-white/10 px-2 py-0.5 rounded bg-white/5">$47,300</span>
                    </div>
                    <div className="h-1 w-full bg-[#1A1A1A] rounded-full relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-[70%] bg-gradient-to-r from-[#FF8C42] to-white rounded-full"></div>
                      <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[13px] text-[#888888] font-medium">Payout Speed</label>
                      <span className="text-[12px] font-mono text-[#FF8C42] bg-[#FF8C42]/10 border border-[#FF8C42]/20 px-2 py-1 rounded">48 Hours</span>
                    </div>
                    <div className="flex items-end gap-2 h-24 pt-2">
                      {[30, 45, 60, 75].map((h, i) => (
                        <div key={i} className={`w-full bg-[#1A1A1A] rounded-sm h-[${h}%] transition-all duration-500 hover:bg-[#222]`}></div>
                      ))}
                      <div className="w-full bg-gradient-to-t from-[#FF8C42]/80 to-[#FF8C42] rounded-sm h-[100%] relative group shadow-[0_0_20px_-5px_rgba(255,140,66,0.4)]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-20"></div>
        </section>

        {/* --- TRUSTED BY RIBBON --- */}
        <section className="py-10 border-b border-white/5 bg-[#080808] overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#080808] to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#080808] to-transparent z-10"></div>

          <div className="max-w-7xl mx-auto px-6 mb-6">
            <p className="text-center text-[10px] font-mono font-bold tracking-[0.3em] text-[#444] uppercase">
              Trusted by Industry Leaders
            </p>
          </div>

          <div className="flex animate-marquee whitespace-nowrap">
            <div className="flex items-center gap-16 md:gap-32 mx-8">
              {logos.map((brand, i) => (
                <div key={i} className="text-xl md:text-2xl font-bold font-mono tracking-tighter text-[#333] hover:text-[#FF8C42] transition-colors duration-500 cursor-default">
                  {brand}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-16 md:gap-32 mx-8">
              {logos.map((brand, i) => (
                <div key={`${i}-clone`} className="text-xl md:text-2xl font-bold font-mono tracking-tighter text-[#333] hover:text-[#FF8C42] transition-colors duration-500 cursor-default">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FOUNDER RESULTS (STATS) --- */}
        <section id="results" className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF8C42]/5 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="mb-16">
              <span className="text-[#FF8C42] font-mono text-xs tracking-widest uppercase mb-2 block">Community</span>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">Platform Results</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: "5000+", label: "Active Publishers", desc: "Over 5k verified bloggers" },
                { value: "10k+", label: "Monthly Orders", desc: "Consistent deal flow" },
                { value: "98%", label: "Satisfaction Rate", desc: "From top publishers" },
                { value: "24h", label: "Support Response", desc: "Always here to help" }
              ].map((stat, i) => (
                <div key={i} className="group bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 hover:border-[#FF8C42]/20 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(255,140,66,0.1)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C42]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-[#FF8C42] transition-colors relative z-10">{stat.value}</h3>
                  <p className="text-white font-medium mb-2 relative z-10">{stat.label}</p>
                  <p className="text-sm text-[#666] relative z-10">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- ABOUT US SECTION (NEW) --- */}
        <section id="about" className="py-24 bg-[#080808] relative border-y border-white/5">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-b from-[#111] to-transparent opacity-50 rounded-bl-full pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <span className="text-[#FF8C42] font-mono text-xs tracking-widest uppercase mb-2 block">Who We Are</span>
                  <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">About <span className="text-[#FF8C42]">LinkMag</span></h2>
                  <div className="w-20 h-1 bg-[#FF8C42] rounded-full"></div>
                </div>

                <div className="space-y-6 text-[#999] text-lg font-light leading-relaxed">
                  <p>Link Management is a Publisher Aggregator Platform which connects publishers and bloggers with Advertisers (Brands, Agencies and Resellers). The Platform is intended to help Publishers and Bloggers monetize their blogs/websites and open up a stable revenue stream for themselves.</p>
                  <p>Our vast experience of working in the Content Marketing and Link Building industry has allowed us to connect with numerous publishers and advertisers. We wanted to create a positive and trustworthy platform, which helps both publishers and advertisers mutually benefit from each other.</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="px-8 py-3 bg-[#FF8C42] text-black font-semibold rounded-lg hover:bg-[#ff9d5e] transition-colors shadow-[0_0_20px_rgba(255,140,66,0.3)]">
                    About Us
                  </button>
                  <button className="px-8 py-3 bg-transparent border border-white/10 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors">
                    Contact Leads
                  </button>
                </div>
              </div>

              {/* Abstract Visual for About */}
              <div className="relative h-[500px] rounded-2xl overflow-hidden bg-[#0F0F0F] border border-white/5 group">
                {/* Using abstract shapes instead of missing image */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,140,66,0.15),transparent_50%)]"></div>
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20">
                  {[...Array(36)].map((_, i) => (
                    <div key={i} className="border-[0.5px] border-white/10"></div>
                  ))}
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-10">
                  <div className="w-24 h-24 mx-auto bg-[#1A1A1A] rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <Users className="w-10 h-10 text-[#FF8C42]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Publisher First</h3>
                  <p className="text-[#666]">Built by creators, for creators.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FEATURES (THE FOUNDER'S TRAP STYLE) --- */}
        <section id="features" className="py-24 bg-[#050505] relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">Why Publishers Choose LinkMag</h2>
              <p className="text-[#888888] text-lg font-light">Most platforms hit a glass ceiling. Our infrastructure is built to scale your content business.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: DollarSign,
                  title: "Continuous Revenue",
                  desc: "Make upwards of $500 every month with consistent brand deals. No more feast or famine cycles."
                },
                {
                  icon: Shield,
                  title: "Secure Payouts",
                  desc: "Request payments whenever you want. Get paid within 24 hours directly to your wallet."
                },
                {
                  icon: Activity,
                  title: "High Quality Content",
                  desc: "SEO-optimized content that adds authority to your website. No compromise on quality."
                }
              ].map((card, idx) => (
                <div key={idx} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-10 hover:border-[#FF8C42]/30 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(255,140,66,0.1)]">
                  <div className="w-14 h-14 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center mb-8 group-hover:border-[#FF8C42]/20 group-hover:bg-[#FF8C42]/10 transition-all duration-300">
                    <card.icon className="w-6 h-6 text-[#888] group-hover:text-[#FF8C42] transition-colors" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-[#FF8C42]/90 transition-colors">{card.title}</h3>
                  <p className="text-[#777] leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS (ROADMAP STYLE) --- */}
        <section id="how-it-works" className="py-32 relative overflow-hidden bg-[#050505]">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="mb-24">
              <span className="text-[#FF8C42] font-mono text-xs tracking-widest uppercase mb-2 block">The Protocol</span>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">The LinkMag System</h2>
              <p className="text-[#666] mt-4 max-w-xl">A streamlined 4-step transformation to monetize your traffic.</p>
            </div>

            <div className="relative border-l border-white/10 ml-4 md:ml-12 space-y-20">
              {[
                {
                  step: "01",
                  phase: "FOUNDATION",
                  title: "Sign Up & List",
                  desc: "Submit your website details. Our team runs metrics checks.",
                  tags: ["Setup"]
                },
                {
                  step: "02",
                  phase: "GROWTH",
                  title: "Receive Orders",
                  desc: "Get relevant order details in your dashboard instantly.",
                  tags: ["Deal Flow"]
                },
                {
                  step: "03",
                  phase: "EXECUTION",
                  title: "Publish & Share",
                  desc: "Publish the content and submit the Live URL for QA.",
                  tags: ["Publishing"]
                },
                {
                  step: "04",
                  phase: "REVENUE",
                  title: "Withdraw",
                  desc: "Request payment withdrawal. Weekly processing, 24h turnaround.",
                  tags: ["Scale"]
                }
              ].map((item, idx) => (
                <div key={idx} className="relative pl-12 md:pl-24 group">
                  {/* Dot */}
                  <div className="absolute -left-[5px] top-6 w-2.5 h-2.5 rounded-full bg-[#050505] border-2 border-[#333] group-hover:border-[#FF8C42] transition-colors duration-300"></div>

                  <div className="flex flex-col md:flex-row gap-8 md:items-start">
                    <div className="flex-1">
                      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-8 max-w-2xl group-hover:border-[#FF8C42]/20 transition-all duration-300 group-hover:bg-[#0F0F0F]">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-white group-hover:text-[#FF8C42] transition-colors">{item.title}</h3>
                          <span className="font-mono text-xs text-[#444] border border-white/5 px-2 py-1 rounded group-hover:text-[#FF8C42] group-hover:border-[#FF8C42]/20">{item.step}</span>
                        </div>
                        <p className="text-[#888] text-sm leading-relaxed mb-6">{item.desc}</p>
                      </div>
                    </div>

                    <div className="md:w-48 pt-8 md:pt-6">
                      <span className="font-mono text-xs text-[#444] uppercase tracking-widest group-hover:text-[#FF8C42] transition-colors">{item.phase}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
