import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="loading-spinner">Loading authentication...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const rawRole = user?.role || user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const userRole = rawRole?.toLowerCase();

        const hasRequiredRole = allowedRoles.some(
            (role) => role.toLowerCase() === userRole
        );

        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;