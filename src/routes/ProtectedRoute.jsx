import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // or wherever your context hook lives

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    // 1. If the user object itself hasn't loaded yet or is null
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Safely extract and check the role.
    // Handles cases where it might be user.role (string) or user.roles (array)
    const userRoles = Array.isArray(user.roles) 
        ? user.roles 
        : user.role 
            ? [user.role] 
            : [];

    // 3. If specific roles are required, check if user matches at least one
    if (allowedRoles && allowedRoles.length > 0) {
        const hasAccess = allowedRoles.some(role => userRoles.includes(role));
        
        if (!hasAccess) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // 4. Everything is fine, render the protected component
    return <Outlet />;
};

export default ProtectedRoute;