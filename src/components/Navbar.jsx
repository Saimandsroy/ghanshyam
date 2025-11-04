import React from 'react';
import { Home, Zap, Info, HelpCircle, Mail, LogIn, UserPlus } from 'lucide-react';
import { AnimeNavBar } from './ui/anime-navbar';

export function Navbar() {
  const navItems = [
    { name: 'Home', url: '#', icon: Home },
    { name: 'Features', url: '#features', icon: Zap },
    { name: 'About', url: '#about', icon: Info },
    { name: 'How It Works', url: '#how-it-works', icon: HelpCircle },
    { name: 'Contact', url: '#contact', icon: Mail },
    { name: 'Login', url: '/login', icon: LogIn },
    { name: 'Sign Up', url: '/signup', icon: UserPlus },
  ];

  return <AnimeNavBar items={navItems} defaultActive="Home" />;
}
