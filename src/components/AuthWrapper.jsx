import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';

const AuthWrapper = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return isLoginMode ? (
      <Login onToggleMode={() => setIsLoginMode(false)} />
    ) : (
      <Register onToggleMode={() => setIsLoginMode(true)} />
    );
  }

  return children;
};

export default AuthWrapper;