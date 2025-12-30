import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-slate-50">
         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
       </div>
     );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
