import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, userRole, requiredRole, children }) => {
  // Jika pengguna tidak terautentikasi atau rolenya tidak sesuai dengan yang diperlukan, redirect ke halaman utama
  if (!isAuthenticated || (userRole !== requiredRole && requiredRole !== "admin")) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;

