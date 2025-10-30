import { useEffect, useRef } from 'react';

export function HeroSection() {
  const heroVisualRef = useRef(null);

  useEffect(() => {
    const container = heroVisualRef.current;
    if (!container) return;
    
  const particles = [];

    
    // Create 20 dynamic particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      particle.style.left = startX + '%';
      particle.style.top = startY + '%';
      
      const tx = (Math.random() - 0.5) * 300;
      const ty = (Math.random() - 0.5) * 300;
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');
      
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
      
      container.appendChild(particle);
      particles.push(particle);
    }
    
    // Cleanup on unmount
    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);

  return (
    <section className="lm-hero">
      <div className="hero">
        <div className="hero-content">
          <div className="badge">Made for Publishers & Bloggers</div>

          <h1>
            Unlock Your Revenue<br />
            <span className="gradient-text">With Premium<br />Sponsorships</span>
          </h1>

          <p className="hero-description">
            Land brand deals, publish high-quality content, and get paid fast. One platform crafted for serious content businesses.
          </p>

          <div className="cta-buttons">
            <a href="#get-started" className="btn btn-primary">Get Started Free</a>
            <a href="#how-it-works" className="btn btn-secondary">See How It Works</a>
          </div>

          <p className="features-note">No credit card • 48h average payout • 24/7 support</p>

          <div className="stats">
            <div className="stat-card">
              <div className="stat-value">$1.2M</div>
              <div className="stat-label">Payouts</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">+68%</div>
              <div className="stat-label">Higher CPM</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>

        <div className="hero-visual" ref={heroVisualRef}>
          {/* Central sphere with orbits */}
          <div className="sphere-container">
            <div className="sphere"></div>
            <div className="orbit"></div>
            <div className="orbit orbit-2"></div>
            <div className="orbit orbit-3"></div>
            
            {/* Expanding rings */}
            <div className="ring"></div>
            <div className="ring"></div>
            <div className="ring"></div>
          </div>

          {/* Floating stat bubbles */}
          <div className="stat-bubble bubble-1">
            <div className="bubble-icon">💰</div>
            <div className="bubble-value">$47.3K</div>
            <div className="bubble-label">Revenue</div>
          </div>

          <div className="stat-bubble bubble-2">
            <div className="bubble-icon">📈</div>
            <div className="bubble-value">+168%</div>
            <div className="bubble-label">Growth</div>
          </div>

          <div className="stat-bubble bubble-3">
            <div className="bubble-icon">⚡</div>
            <div className="bubble-value">48hrs</div>
            <div className="bubble-label">Payout</div>
          </div>

          {/* Energy lines */}
          <div className="energy-line energy-1"></div>
          <div className="energy-line energy-2"></div>
          <div className="energy-line energy-3"></div>
        </div>
      </div>
    </section>
  );
}
