import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Bell, CheckCircle, XCircle, Database, MessageSquare, ClipboardList, LogOut } from 'lucide-react';
import { ModernSidebar } from '../../../components/ModernSidebar';

export const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        navigate('/login');
    };

    const navItems = useMemo(() => [
        {
            icon: <Home size={18} />,
            label: 'Dashboard',
            to: '/teams',
            active: location.pathname === '/teams' || location.pathname === '/teams/'
        },

        {
            icon: <Bell size={18} />,
            label: 'Order Notifications',
            to: '/teams/order-notifications',
            active: location.pathname.startsWith('/teams/order-notifications')
        },
        {
            icon: <CheckCircle size={18} />,
            label: 'Completed Orders',
            to: '/teams/completed-orders',
            active: location.pathname.startsWith('/teams/completed-orders')
        },
        {
            icon: <XCircle size={18} />,
            label: 'Rejected Links',
            to: '/teams/rejected-links',
            active: location.pathname === '/teams/rejected-links'
        },
        {
            icon: <Database size={18} />,
            label: 'New Sites',
            to: '/teams/new-sites',
            active: location.pathname === '/teams/new-sites'
        },
        {
            icon: <MessageSquare size={18} />,
            label: 'Threads',
            to: '/teams/threads',
            active: location.pathname === '/teams/threads'
        }
    ], [location.pathname]);

    return (
        <div className="h-screen overflow-hidden flex bg-[var(--background-dark)] bg-grid-pattern text-[var(--text-primary)]">
            <ModernSidebar
                navItems={navItems}
                userName="Team Member"
                userRole="Team"
                onLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col min-w-0 h-full relative">
                {/* Glass Header Effect */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-[var(--background-dark)]/80 backdrop-blur-md z-10 border-b border-[var(--border)] lg:hidden" />

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar relative z-0">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};
