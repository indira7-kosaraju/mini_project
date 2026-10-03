import React from 'react';
import { Navigate } from 'react-router-dom';

// Reads adminToken on every render so login/logout take effect without a page refresh
const AdminRoute = ({ children, guestOnly = false }) => {
    const isAdmin = !!localStorage.getItem('adminToken');

    if (guestOnly) {
        return isAdmin ? <Navigate to="/admin/dashboard" /> : children;
    }

    return isAdmin ? children : <Navigate to="/admin/login" />;
};

export default AdminRoute;
