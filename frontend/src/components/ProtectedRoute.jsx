import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, user }) => {
  const navigate = useNavigate();

  // If user is not logged in, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  // If user role is not in allowed roles, redirect to unauthorized page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    navigate('/unauthorized');
    return null;
  }

  // If user is authenticated and has the right role, render children
  return children;
};

export default ProtectedRoute;