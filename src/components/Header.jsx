import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Stock Research Platform
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-600">
              Welcome, <span className="font-medium">{user?.username}</span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;