import React, { useEffect, useState, useRef } from 'react';
import { Play, TrendingUp, CheckCircle, ArrowRight, DollarSign, Clock, FileText, Lock, Heart, HelpCircle, ChevronRight, Activity, Zap, Shield, Users, Menu, X } from 'lucide-react';
import { Footer } from '../components/Footer';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * PREMIUM INTERACTIVE LIGHT THEME LANDING PAGE
 * Features: Framer Motion physics, staggered entrances, scroll parallax,
 * and high-end glassmorphic interactive cards.
 */

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  
  // Advanced Scroll Effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const yHeroText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yHeroCard = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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

  // Stagger configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        brightness: 0.8,
        stiffness: 100, 
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 antialiased overflow-x-hidden selection:bg-[#F97316] selection:text-white font-sans" ref={containerRef}>

      {/* --- FLOATING AMBIENT ORBS --- */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#F97316]/5 blur-[120px] rounded-full pointer-events-none z-0"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -60, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-0"
      />

      {/* --- MOBILE NAVIGATION SUPER LAYOUT --- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl md:hidden flex flex-col pt-24 px-8 pb-8 transition-all animate-fade-in shadow-2xl">
          <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
          <div className="flex flex-col gap-8 text-center text-2xl font-black text-slate-800">
             {['Home', 'About', 'Features', 'Results', 'How it Works'].map((item, i) => (
                <a key={i} onClick={() => setMobileMenuOpen(false)} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-[#F97316] transition-colors">{item}</a>
             ))}
             <div className="h-px w-full bg-slate-200 my-2"></div>
             <a href="/login" className="hover:text-slate-900 text-slate-600">Login</a>
             <a href="/signup" className="text-[#F97316]">Start Free</a>
          </div>
        </div>
      )}

      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3' : 'bg-transparent border-b border-transparent py-4 md:py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity group"
          >
            <div className="w-10 h-10 relative overflow-hidden rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-[#F97316]/40 group-hover:shadow-[#F97316]/20 transition-all duration-300">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-[250%] max-w-none absolute left-0 top-1/2 -translate-y-1/2 object-cover"
                style={{ objectPosition: 'left center' }}
              />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">Link Management</span>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="hidden md:flex items-center gap-10 bg-white/50 backdrop-blur-md px-8 py-2.5 rounded-full border border-slate-200/50 shadow-sm"
          >
            {['Home', 'About', 'Features', 'Results', 'How it Works'].map((item, i) => (
               <a key={i} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-semibold text-slate-600 hover:text-[#F97316] transition-colors relative group">
                 {item}
                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F97316] rounded-full transition-all duration-300 group-hover:w-full"></span>
               </a>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
             className="flex items-center gap-5"
          >
            <a href="/login" className="hidden md:block text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Login →</a>
            <a href="/signup" className="hidden md:inline-flex relative h-11 items-center justify-center overflow-hidden rounded-full bg-[#F97316] px-8 font-bold text-white transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:-translate-y-0.5 active:scale-95 group">
               <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
               <span className="relative">Start Free</span>
            </a>
            
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-slate-700 bg-white/50 backdrop-blur-md border border-slate-200 rounded-full hover:bg-slate-100 transition-colors shadow-sm ml-2">
              <Menu className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </nav>

      <main>
        {/* --- HERO SECTION --- */}
        <section className="relative min-h-[100svh] flex items-center justify-center pt-28 pb-20 overflow-visible z-10">

          {/* Soft Premium Ambient Background */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-60 overflow-hidden">
            <div className="absolute top-0 right-0 md:right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-50 blur-[80px] md:blur-[120px] rounded-full mix-blend-multiply"></div>
            <div className="absolute bottom-1/4 left-0 md:left-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-orange-50 blur-[70px] md:blur-[100px] rounded-full mix-blend-multiply"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-blue-50/50 blur-[100px] md:blur-[150px] rounded-full mix-blend-multiply"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full relative z-10 w-full"
               style={{ perspective: '1000px' }}
          >
            {/* Left Content */}
            <motion.div 
               className="lg:col-span-6 space-y-8"
               variants={containerVariants}
               initial="hidden"
               animate="show"
               style={{ y: yHeroText, opacity: opacityHero }}
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#F97316]/20 bg-white/60 backdrop-blur-md shadow-[0_2px_10px_rgba(249,115,22,0.05)]">
                <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse"></span>
                <span className="text-xs font-bold tracking-widest text-[#F97316] uppercase">Trusted by 5,000+ Publishers</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-[2.75rem] sm:text-6xl lg:text-[5rem] leading-[1.1] md:leading-[1.05] font-black tracking-tighter text-slate-900 mt-4 md:mt-0">
                Unlock Your <br />
                <span className="relative inline-block mt-2 mb-2">
                  <span className="absolute -inset-1 bg-gradient-to-r from-[#F97316] to-[#FF9D5C] blur-lg opacity-30 animate-pulse"></span>
                  <span className="relative bg-gradient-to-br from-[#F97316] to-[#EA580C] bg-clip-text text-transparent">
                    Revenue
                  </span>
                </span> With <br />
                Sponsorships.
              </motion.h1>

              <motion.p variants={itemVariants} className="text-xl text-slate-600 max-w-[500px] leading-relaxed font-medium">
                Land brand deals, publish high-quality content, and get paid fast. One systematic platform crafted for serious content businesses.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 pt-4">
                <a href="/signup" className="group relative bg-slate-900 text-white pl-8 pr-10 py-4 rounded-full text-[16px] font-bold transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-[#F97316]/30 hover:-translate-y-1 hover:bg-[#F97316] overflow-hidden text-center sm:text-left flex items-center justify-center sm:justify-start gap-3">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>

                <a href="#about" className="group flex items-center justify-center sm:justify-start gap-4 px-8 py-4 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-700 hover:text-[#F97316] hover:border-[#F97316]/30 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-lg">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#F97316]/10 group-hover:scale-110 transition-all">
                    <Play className="w-4 h-4 fill-current ml-0.5" strokeWidth={0} />
                  </div>
                  <span className="text-[16px] font-bold">Watch Demo</span>
                </a>
              </motion.div>
              
              <motion.div variants={itemVariants} className="pt-8 flex items-center gap-6 text-sm font-bold text-slate-400">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" /> No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Cancel anytime
                </span>
              </motion.div>
            </motion.div>

            {/* Right Content: 3D Floated Interactive Dashboard Card */}
            <motion.div 
               className="lg:col-span-6 relative z-20 mt-12 lg:mt-0 px-2 sm:px-0 hidden md:block"
               initial={{ opacity: 0, x: 50, rotateY: -10 }}
               animate={{ opacity: 1, x: 0, rotateY: 0 }}
               transition={{ duration: 1.2, type: "spring", bounce: 0.4, delay: 0.4 }}
               style={{ y: yHeroCard }}
            >
               {/* Decorative elements behind card */}
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                 className="absolute -right-10 -top-10 w-40 h-40 border border-slate-200 rounded-full border-dashed opacity-50 pointer-events-none"
               ></motion.div>
               <motion.div 
                 animate={{ rotate: -360 }} 
                 transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                 className="absolute -left-10 -bottom-10 w-64 h-64 border border-[#F97316]/20 rounded-full border-dashed opacity-50 pointer-events-none"
               ></motion.div>
            
               <motion.div 
                 whileHover={{ scale: 1.02, rotateY: -2, rotateX: 2 }}
                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
                 className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] w-full max-w-lg ml-auto p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white group transform-gpu cursor-default"
               >
                 {/* Shiny border hover effect */}
                 <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/50 to-white/10 pointer-events-none border border-white"></div>
                 
                 {/* Sweeping light line on hover */}
                 <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-20deg] group-hover:animate-sweep pointer-events-none z-20 mix-blend-overlay"></div>

                  <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-5 relative z-10">
                    <span className="font-bold text-[11px] uppercase tracking-[0.2em] text-slate-400">Live Workspace Status</span>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200/50 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[11px] text-green-700 font-bold">Connecting...</span>
                    </div>
                  </div>

                  <div className="space-y-10 relative z-10">
                    {/* Revenue Metric */}
                    <div className="group/metric">
                      <div className="flex justify-between mb-3 items-end">
                        <label className="text-sm text-slate-500 font-bold">Monthly Revenue</label>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-1.5 bg-green-100/50 px-2 py-1 rounded-md border border-green-200"
                        >
                          <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-xs text-green-700 font-bold">+12.5%</span>
                        </motion.div>
                      </div>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-5xl font-black text-slate-900 tracking-tight">$47,300</span>
                        <span className="text-base font-bold text-slate-400">.00</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full relative overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "70%" }}
                          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#F97316] to-[#FB923C] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                        ></motion.div>
                      </div>
                    </div>

                    {/* Payout Speed */}
                    <div>
                      <div className="flex justify-between items-center mb-5">
                        <label className="text-sm text-slate-500 font-bold">Average Payout Velocity</label>
                        <span className="text-[11px] font-black text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
                          <Clock className="w-3 h-3" />
                          48 Hours
                        </span>
                      </div>
                      <div className="flex items-end gap-2 h-24">
                        {[30, 45, 55, 65, 75, 85].map((h, i) => (
                           <motion.div 
                             initial={{ height: 0 }}
                             animate={{ height: `${h}%` }}
                             transition={{ duration: 0.8, delay: 0.8 + (i * 0.1), type: 'spring' }}
                             key={i} 
                             className="flex-1 bg-slate-100 rounded-t-md relative group/bar hover:bg-slate-200 transition-colors cursor-pointer"
                           >
                             <div className="absolute bottom-0 left-0 w-full bg-[#F97316] opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300 rounded-t-md" style={{ height: '100%' }}></div>
                           </motion.div>
                        ))}
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: "100%" }}
                          transition={{ duration: 0.8, delay: 1.4, type: 'spring' }}
                          className="flex-1 bg-gradient-to-t from-[#F97316] to-[#FB923C] rounded-t-md relative shadow-[0_0_15px_rgba(249,115,22,0.3)] cursor-pointer group/now"
                        >
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-7 opacity-0 group-hover/now:opacity-100 transition-opacity whitespace-nowrap">
                            <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded shadow-lg">Target</span>
                            <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- TRUSTED BY RIBBON --- */}
        <section className="py-12 border-b border-slate-200 bg-white overflow-hidden relative z-20 shadow-sm">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 hidden md:block"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 hidden md:block"></div>

          <div className="max-w-7xl mx-auto px-6 mb-8">
            <p className="text-center text-[11px] font-bold tracking-[0.3em] text-slate-400 uppercase">
              Monetized By Industry Leaders
            </p>
          </div>

          <div className="flex animate-marquee whitespace-nowrap">
            <div className="flex items-center gap-16 md:gap-32 mx-8">
              {logos.map((brand, i) => (
                <div key={i} className="text-xl md:text-2xl font-black tracking-tight text-slate-300 hover:text-slate-900 hover:scale-110 transition-all duration-300 cursor-default">
                  {brand}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-16 md:gap-32 mx-8">
              {logos.map((brand, i) => (
                <div key={`${i}-clone`} className="text-xl md:text-2xl font-black tracking-tight text-slate-300 hover:text-slate-900 hover:scale-110 transition-all duration-300 cursor-default">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FOUNDER RESULTS (STATS) --- */}
        <section id="results" className="py-24 md:py-32 relative overflow-hidden bg-[#FAFAFA]">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
               className="mb-16 text-center"
            >
              <span className="text-[#F97316] font-bold text-xs tracking-widest uppercase mb-3 block">Network Scale</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900">Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">Results</span></h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: "5,000+", label: "Active Publishers", desc: "Verified content creators." },
                { value: "10k+", label: "Monthly Orders", desc: "Consistent inbound deal flow." },
                { value: "98%", label: "Satisfaction Rate", desc: "From top tier publishers." },
                { value: "24h", label: "Support Turnaround", desc: "Dedicated account managers." }
              ].map((stat, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  key={i} 
                  whileHover={{ y: -10 }}
                  className="group bg-white border border-slate-200 rounded-[2rem] p-10 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-[#F97316]/10 hover:border-[#F97316]/30 relative overflow-hidden"
                >
                  <div className="w-12 h-12 bg-slate-50 rounded-xl mb-6 flex items-center justify-center group-hover:bg-[#F97316]/10 group-hover:scale-110 transition-all duration-300">
                    <div className="w-4 h-4 bg-slate-300 rounded-full group-hover:bg-[#F97316] transition-colors"></div>
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-[#F97316] transition-colors">{stat.value}</h3>
                  <p className="text-slate-800 font-bold mb-2 text-lg">{stat.label}</p>
                  <p className="text-sm text-slate-500 font-medium">{stat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- ABOUT US SECTION --- */}
        <section id="about" className="py-24 bg-white relative border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                 initial={{ opacity: 0, x: -30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
                 className="space-y-8"
              >
                <div>
                  <span className="text-[#F97316] font-bold text-xs tracking-widest uppercase mb-2 block">Who We Are</span>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">About <span className="text-[#F97316]">Link Management</span></h2>
                  <div className="w-20 h-1.5 bg-[#F97316] rounded-full"></div>
                </div>

                <div className="space-y-6 text-slate-600 text-lg font-medium leading-relaxed">
                  <p>Link Management is a Publisher Aggregator Platform which connects publishers and bloggers with Advertisers (Brands, Agencies and Resellers). The Platform is intended to help Publishers and Bloggers monetize their blogs/websites and open up a stable revenue stream for themselves.</p>
                  <p>Our vast experience of working in the Content Marketing and Link Building industry has allowed us to connect with numerous publishers and advertisers. We wanted to create a positive and trustworthy platform, which helps both publishers and advertisers mutually benefit from each other.</p>
                </div>

                <div className="flex gap-4 pt-4">
                 <button className="group relative px-8 py-3.5 bg-slate-900 text-white font-bold rounded-full overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-[#F97316] hover:-translate-y-0.5">
                    <span className="relative">About Us</span>
                  </button>
                  <button className="group px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-50 transition-all duration-300 hover:border-[#F97316] hover:text-[#F97316] shadow-sm">
                    Contact Leads
                  </button>
                </div>
              </motion.div>

              {/* Abstract Visual for About */}
              <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="relative h-[300px] md:h-[500px] rounded-[2rem] overflow-hidden bg-[#FAFAFA] border border-slate-200 shadow-2xl shadow-slate-200/50 group flex items-center justify-center transform-gpu mt-8 lg:mt-0"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent_50%)]"></div>
                
                <div className="text-center w-full px-10 relative z-10">
                  <div className="w-24 h-24 mx-auto bg-white rounded-2xl border border-slate-100 flex items-center justify-center mb-6 shadow-xl shadow-[#F97316]/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 group-hover:border-[#F97316]/20">
                    <Users className="w-10 h-10 text-[#F97316]" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Publisher First</h3>
                  <p className="text-slate-500 font-medium max-w-xs mx-auto">Built by content creators, optimized for content creators.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- FEATURES --- */}
        <section id="features" className="py-24 bg-[#FAFAFA] relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="max-w-2xl mx-auto text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">Why Publishers Choose Link Management</h2>
              <p className="text-slate-600 text-lg font-medium">Most platforms hit a glass ceiling. Our infrastructure is built to scale your content business.</p>
            </motion.div>

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
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  key={idx} 
                  className="bg-white border border-slate-200 rounded-3xl p-10 hover:border-[#F97316]/30 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#F97316]/5"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center mb-8 group-hover:border-[#F97316]/20 group-hover:bg-[#F97316]/5 transition-all duration-300">
                    <card.icon className="w-7 h-7 text-slate-400 group-hover:text-[#F97316] transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{card.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS --- */}
        <section id="how-it-works" className="py-32 relative overflow-hidden bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="mb-24 text-center md:text-left"
            >
              <span className="text-[#F97316] font-bold text-xs tracking-widest uppercase mb-2 block">The Protocol</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">The Link Management System</h2>
              <p className="text-slate-600 mt-4 max-w-xl font-medium">A streamlined 4-step transformation to monetize your traffic.</p>
            </motion.div>

            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-12 space-y-20">
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
                <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true, margin: "-100px" }}
                   transition={{ duration: 0.5, delay: idx * 0.1 }}
                   key={idx} 
                   className="relative pl-12 md:pl-24 group"
                >
                  {/* Dot */}
                  <div className="absolute -left-[10px] top-6 w-5 h-5 rounded-full bg-white border-[4px] border-slate-300 group-hover:border-[#F97316] transition-colors duration-300"></div>

                  <div className="flex flex-col md:flex-row gap-8 md:items-start">
                    <div className="flex-1">
                      <div className="bg-[#FAFAFA] border border-slate-200 rounded-2xl p-8 max-w-2xl group-hover:border-[#F97316]/30 transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:bg-white">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                          <span className="font-bold text-xs text-slate-500 bg-slate-200 px-3 py-1 rounded-full group-hover:bg-[#F97316]/10 group-hover:text-[#F97316] transition-colors">{item.step}</span>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    <div className="md:w-48 pt-8 md:pt-6">
                      <span className="font-bold text-xs text-slate-400 uppercase tracking-widest group-hover:text-[#F97316] transition-colors">{item.phase}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
