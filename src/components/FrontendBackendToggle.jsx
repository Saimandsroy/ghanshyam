import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * FrontendBackendToggle Component
 * 
 * A toggle component for switching between Frontend and Backend views.
 * Designed for authenticated dashboard pages.
 * 
 * Features:
 * - URL parameter support (?view=frontend or ?view=backend)
 * - Session storage persistence
 * - Clean, professional design matching the design system
 * - Responsive (mobile optimized)
 */
const FrontendBackendToggle = ({ onViewChange, defaultView = 'frontend', className = '' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeView, setActiveView] = useState(defaultView);

  // Initialize view from URL or session storage
  useEffect(() => {
    const urlView = searchParams.get('view');
    const savedView = sessionStorage.getItem('dashboardView');
    
    if (urlView && (urlView === 'frontend' || urlView === 'backend')) {
      setActiveView(urlView);
      sessionStorage.setItem('dashboardView', urlView);
    } else if (savedView) {
      setActiveView(savedView);
      setSearchParams({ view: savedView }, { replace: true });
    } else {
      setSearchParams({ view: defaultView }, { replace: true });
    }
  }, []);

  // Handle view toggle
  const handleToggle = (view) => {
    setActiveView(view);
    sessionStorage.setItem('dashboardView', view);
    setSearchParams({ view }, { replace: true });
    
    // Callback to parent component
    if (onViewChange) {
      onViewChange(view);
    }
  };

  return (
    <div 
      className={`inline-flex items-center gap-1 p-1 rounded-lg border border-[var(--border)] bg-[var(--card-background)] ${className}`}
      role="tablist"
      aria-label="View toggle"
    >
      <button
        onClick={() => handleToggle('frontend')}
        className={`
          px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200
          ${activeView === 'frontend' 
            ? 'bg-[var(--primary-cyan)] text-[var(--background-dark)]' 
            : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }
        `}
        role="tab"
        aria-selected={activeView === 'frontend'}
        aria-controls="dashboard-content"
      >
        Frontend View
      </button>
      <button
        onClick={() => handleToggle('backend')}
        className={`
          px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200
          ${activeView === 'backend' 
            ? 'bg-[var(--primary-cyan)] text-[var(--background-dark)]' 
            : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }
        `}
        role="tab"
        aria-selected={activeView === 'backend'}
        aria-controls="dashboard-content"
      >
        Backend View
      </button>
    </div>
  );
};

// Mobile-optimized version
export const FrontendBackendToggleMobile = ({ onViewChange, defaultView = 'frontend' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeView, setActiveView] = useState(defaultView);

  useEffect(() => {
    const urlView = searchParams.get('view');
    const savedView = sessionStorage.getItem('dashboardView');
    
    if (urlView && (urlView === 'frontend' || urlView === 'backend')) {
      setActiveView(urlView);
      sessionStorage.setItem('dashboardView', urlView);
    } else if (savedView) {
      setActiveView(savedView);
      setSearchParams({ view: savedView }, { replace: true });
    } else {
      setSearchParams({ view: defaultView }, { replace: true });
    }
  }, []);

  const handleToggle = (view) => {
    setActiveView(view);
    sessionStorage.setItem('dashboardView', view);
    setSearchParams({ view }, { replace: true });
    
    if (onViewChange) {
      onViewChange(view);
    }
  };

  return (
    <div 
      className="inline-flex items-center gap-1 p-1 rounded-lg border border-[var(--border)] bg-[var(--card-background)]"
      role="tablist"
      aria-label="View toggle"
    >
      <button
        onClick={() => handleToggle('frontend')}
        className={`
          px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200
          ${activeView === 'frontend' 
            ? 'bg-[var(--primary-cyan)] text-[var(--background-dark)]' 
            : 'bg-transparent text-[var(--text-secondary)]'
          }
        `}
        role="tab"
        aria-selected={activeView === 'frontend'}
      >
        Frontend
      </button>
      <button
        onClick={() => handleToggle('backend')}
        className={`
          px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200
          ${activeView === 'backend' 
            ? 'bg-[var(--primary-cyan)] text-[var(--background-dark)]' 
            : 'bg-transparent text-[var(--text-secondary)]'
          }
        `}
        role="tab"
        aria-selected={activeView === 'backend'}
      >
        Backend
      </button>
    </div>
  );
};

export default FrontendBackendToggle;
