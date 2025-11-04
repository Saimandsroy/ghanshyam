/**
 * Example: How to Replace Current Navbar with AnimeNavBar
 * 
 * Option 1: Replace the entire Navbar component
 * Option 2: Use it alongside (toggle between styles)
 * 
 * This file shows both approaches.
 */

import React from 'react';
import { 
  Home, 
  Zap, 
  Info, 
  HelpCircle, 
  Mail, 
  LogIn, 
  UserPlus 
} from 'lucide-react';
import { AnimeNavBar } from './ui/anime-navbar';

// OPTION 1: Direct Replacement
// Replace the content of src/components/Navbar.jsx with this:

export function Navbar() {
  const navItems = [
    { name: 'Home', url: '#', icon: Home },
    { name: 'Features', url: '#features', icon: Zap },
    { name: 'About', url: '#about', icon: Info },
    { name: 'FAQ', url: '#faqs', icon: HelpCircle },
    { name: 'Contact', url: '#contact', icon: Mail },
    // Uncomment these if you want login/signup in the navbar
    // { name: 'Login', url: '/login', icon: LogIn },
    // { name: 'Sign Up', url: '/signup', icon: UserPlus },
  ];

  return <AnimeNavBar items={navItems} defaultActive="Home" />;
}

// OPTION 2: Use in LandingPage.jsx directly
// In src/pages/LandingPage.jsx:

/*
import { AnimeNavBar } from '@/components/ui/anime-navbar';
import { Home, Zap, Info, Mail } from 'lucide-react';

export function LandingPage() {
  const navItems = [
    { name: 'Home', url: '#', icon: Home },
    { name: 'Features', url: '#features', icon: Zap },
    { name: 'About', url: '#about', icon: Info },
    { name: 'Contact', url: '#contact', icon: Mail },
  ];

  return (
    <div className="min-h-screen">
      <AnimeNavBar items={navItems} defaultActive="Home" />
      
      {/* Your existing sections - make sure they have matching IDs *\/}
      <HeroSection />
      <section id="features">
        <FeaturesSection />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      {/* ... rest of your content *\/}
    </div>
  );
}
*/

// OPTION 3: Conditional Navbar (for testing)
// Use this to test both navbars side by side:

/*
export function Navbar() {
  const [useAnime, setUseAnime] = useState(true);
  
  const animeItems = [
    { name: 'Home', url: '#', icon: Home },
    { name: 'Features', url: '#features', icon: Zap },
    { name: 'About', url: '#about', icon: Info },
    { name: 'Contact', url: '#contact', icon: Mail },
  ];

  if (useAnime) {
    return <AnimeNavBar items={animeItems} defaultActive="Home" />;
  }

  // Your old navbar code here
  return <YourOldNavbar />;
}
*/
