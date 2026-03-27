import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Theme Context for Dark/Light Mode
 * 
 * Provides theme state and toggle functionality across the app
 */

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    localStorage.setItem('dashboard-theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);

  const toggleTheme = () => {
    // Disabled as per $1M light exclusive redesign
    console.log("Dark mode disabled for premium aesthetic.");
  };

  const value = {
    theme: 'light',
    toggleTheme,
    isDark: false
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
