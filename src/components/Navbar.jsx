import { Home, User, Briefcase, FileText } from 'lucide-react';
import { NavBar } from './ui/tubelight-navbar';

export function Navbar() {
  const items = [
    { name: 'Home', url: '#', icon: Home },
    { name: 'About Us', url: '#about', icon: User },
    { name: 'Careers', url: '#careers', icon: Briefcase },
    { name: 'Faqs', url: '#faqs', icon: FileText },
    { name: 'Videos', url: '#videos', icon: FileText },
    { name: 'Contact', url: '#contact', icon: User },
    { name: 'Login', url: '/login', icon: User },
    { name: 'SIGNUP', url: '/signup', icon: User },
    { name: 'Manager', url: '/manager', icon: User },
    { name: 'Teams', url: '/teams', icon: User },
  ];

  return <NavBar items={items} className="sm:pt-4" />;
}
