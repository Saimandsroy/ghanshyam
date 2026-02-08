import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function ChangePasswordRedirect() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    switch (user?.role) {
        case 'Admin':
            return <Navigate to="/admin/change-password" replace />;
        case 'Manager':
            return <Navigate to="/manager/change-password" replace />;
        case 'Team':
            return <Navigate to="/teams/change-password" replace />;
        case 'Writer':
            return <Navigate to="/writer/change-password" replace />;
        case 'Blogger':
            return <Navigate to="/blogger/change-password" replace />;
        case 'Accountant':
            // Accountant might not have a profile, defaulting to home or dashboard
            return <Navigate to="/accountant" replace />;
        default:
            return <Navigate to="/" replace />;
    }
}
