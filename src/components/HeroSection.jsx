import React from 'react';
import { ArrowRight, CheckCircle, DollarSign, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden noise-texture"
      style={{
        background: 'linear-gradient(135deg, var(--deep-purple) 0%, var(--background-dark) 100%)',
      }}
    >
      {/* Subtle diagonal grid lines */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 50px,
            rgba(44, 52, 69, 0.1) 50px,
            rgba(44, 52, 69, 0.1) 51px
          )`
        }}
      />

      {/* Single accent glow - top right */}
      <div 
        className="absolute top-0 right-0 w-[800px] h-[800px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(107, 240, 255, 0.05) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN - 60% (3/5) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Trust indicator */}
            <div className="flex items-center gap-2">
              <CheckCircle size={16} color="var(--primary-cyan)" />
              <span 
                className="text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Trusted by 5,000+ publishers
              </span>
            </div>

            {/* Headline */}
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Unlock Your Revenue{' '}
              <br className="hidden md:block" />
              <span className="gradient-text">
                With Premium Sponsorships
              </span>
            </h1>

            {/* Subheadline */}
            <p 
              className="text-lg md:text-xl max-w-2xl leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Land brand deals, publish high-quality content, and get paid fast. One platform crafted for serious content businesses.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#get-started" 
                className="btn btn-primary inline-flex items-center justify-center gap-2 text-base px-8 py-4"
              >
                Get Started Free
                <ArrowRight size={20} />
              </a>
              <a 
                href="#how-it-works" 
                className="btn btn-secondary inline-flex items-center justify-center text-base px-8 py-4"
              >
                See How It Works
              </a>
            </div>

            {/* Inline stats */}
            <div 
              className="flex flex-wrap items-center gap-4 text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              <span>$1.2M paid out</span>
              <span 
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: 'var(--text-muted)' }}
              />
              <span>68% higher CPM</span>
              <span 
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: 'var(--text-muted)' }}
              />
              <span>24/7 support</span>
            </div>
          </div>

          {/* RIGHT COLUMN - 40% (2/5) - Animated Orbital Stats */}
          <div className="lg:col-span-2 relative h-[400px] md:h-[500px] lg:h-[600px]">
            {/* Central orbital circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Outer orbit ring */}
              <motion.div
                className="absolute w-[400px] h-[400px] rounded-full border border-[var(--primary-cyan)]/10"
                animate={{
                  rotate: 360,
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              
              {/* Middle orbit ring */}
              <motion.div
                className="absolute w-[300px] h-[300px] rounded-full border border-[var(--primary-cyan)]/15"
                animate={{
                  rotate: -360,
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              
              {/* Inner orbit ring */}
              <motion.div
                className="absolute w-[200px] h-[200px] rounded-full border border-[var(--primary-cyan)]/20"
                animate={{
                  rotate: 360,
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              />

              {/* Central glow */}
              <motion.div
                className="absolute w-24 h-24 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(107, 240, 255, 0.2) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Floating Stat Cards */}
            {/* Revenue Card - Top Right */}
            <motion.div
              className="absolute top-[15%] right-[5%] w-40 md:w-48"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
              }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.div
                className="card p-4 md:p-5"
                style={{
                  background: 'rgba(26, 34, 51, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(107, 240, 255, 0.2)',
                }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full mb-3"
                  style={{ backgroundColor: 'rgba(107, 240, 255, 0.15)' }}>
                  <DollarSign size={20} style={{ color: 'var(--primary-cyan)' }} />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: 'var(--primary-cyan)' }}>
                  $47.3K
                </div>
                <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  Revenue
                </div>
              </motion.div>
            </motion.div>

            {/* Growth Card - Middle Left */}
            <motion.div
              className="absolute top-[45%] left-[5%] w-40 md:w-44"
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
              }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.div
                className="card p-4 md:p-5"
                style={{
                  background: 'rgba(26, 34, 51, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(107, 240, 255, 0.2)',
                }}
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full mb-3"
                  style={{ backgroundColor: 'rgba(107, 240, 255, 0.15)' }}>
                  <TrendingUp size={20} style={{ color: 'var(--primary-cyan)' }} />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: 'var(--primary-cyan)' }}>
                  +168%
                </div>
                <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  Growth
                </div>
              </motion.div>
            </motion.div>

            {/* Payout Card - Bottom Right */}
            <motion.div
              className="absolute bottom-[15%] right-[8%] w-40 md:w-44"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
              }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <motion.div
                className="card p-4 md:p-5"
                style={{
                  background: 'rgba(26, 34, 51, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(107, 240, 255, 0.2)',
                }}
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full mb-3"
                  style={{ backgroundColor: 'rgba(107, 240, 255, 0.15)' }}>
                  <Zap size={20} style={{ color: 'var(--primary-cyan)' }} />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: 'var(--primary-cyan)' }}>
                  48hrs
                </div>
                <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  Payout
                </div>
              </motion.div>
            </motion.div>

            {/* Connecting Lines/Dots */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
              <motion.line
                x1="50%"
                y1="50%"
                x2="80%"
                y2="20%"
                stroke="var(--primary-cyan)"
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <motion.line
                x1="50%"
                y1="50%"
                x2="20%"
                y2="50%"
                stroke="var(--primary-cyan)"
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 2, delay: 0.7 }}
              />
              <motion.line
                x1="50%"
                y1="50%"
                x2="80%"
                y2="80%"
                stroke="var(--primary-cyan)"
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 2, delay: 0.9 }}
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
