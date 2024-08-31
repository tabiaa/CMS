import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token || userRole !== role) {
        return <Navigate to={`/${role}-login`} replace />;
    }

    return children;
};

export default PrivateRoute;
