import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Register = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // Check if email is whitelisted before attempting registration
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const whitelistResponse = await axios.get(`${apiUrl}/api/auth/check-whitelist/${encodeURIComponent(formData.email)}`);
      
      if (!whitelistResponse.data.whitelisted) {
        setError('Your email is not authorized to create an account. Please contact the administrator for access.');
        setLoading(false);
        return;
      }

      // Proceed with registration if email is whitelisted
      const result = await register(formData.email, formData.username, formData.password);
      
      if (!result.success) {
        // Provide more specific error messages
        if (result.error.includes('Email already registered')) {
          setError('This email address is already registered. Please try logging in instead.');
        } else if (result.error.includes('Username already taken')) {
          setError('This username is already taken. Please choose a different username.');
        } else if (result.error.includes('Email not authorized')) {
          setError('Your email is not authorized to create an account. Please contact the administrator for access.');
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      console.error('Registration process failed:', error);
      if (error.response?.status === 400) {
        const errorDetail = error.response.data?.detail || 'Registration failed';
        if (errorDetail.includes('Email already registered')) {
          setError('This email address is already registered. Please try logging in instead.');
        } else if (errorDetail.includes('Username already taken')) {
          setError('This username is already taken. Please choose a different username.');
        } else {
          setError(errorDetail);
        }
      } else {
        setError('Unable to complete registration. Please try again later.');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Join the stock research platform
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Only authorized email addresses can create accounts. 
              Contact your administrator if you need access.
            </p>
          </div>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Choose a username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;