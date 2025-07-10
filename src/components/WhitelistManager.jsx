import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WhitelistManager = () => {
  const [whitelist, setWhitelist] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    loadWhitelist();
  }, []);

  const loadWhitelist = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/auth/whitelist`);
      setWhitelist(response.data.whitelist);
    } catch (error) {
      console.error('Failed to load whitelist:', error);
      if (error.response?.status === 403) {
        setError('Admin access required to manage whitelist');
      } else {
        setError('Failed to load whitelist');
      }
    }
  };

  const addEmail = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`${apiUrl}/api/auth/whitelist`, { email: newEmail });
      setSuccess(`Email ${newEmail} added to whitelist`);
      setNewEmail('');
      await loadWhitelist();
    } catch (error) {
      if (error.response?.status === 403) {
        setError('Admin access required to manage whitelist');
      } else {
        setError(error.response?.data?.detail || 'Failed to add email');
      }
    }

    setLoading(false);
  };

  const removeEmail = async (email) => {
    if (!confirm(`Remove ${email} from whitelist?`)) return;

    try {
      await axios.delete(`${apiUrl}/api/auth/whitelist/${encodeURIComponent(email)}`);
      setSuccess(`Email ${email} removed from whitelist`);
      await loadWhitelist();
    } catch (error) {
      if (error.response?.status === 403) {
        setError('Admin access required to manage whitelist');
      } else {
        setError(error.response?.data?.detail || 'Failed to remove email');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Whitelist Management</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Add Email Form */}
        <form onSubmit={addEmail} className="mb-8">
          <div className="flex gap-4">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter email to whitelist"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Email'}
            </button>
          </div>
        </form>

        {/* Whitelist Display */}
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4">
            Whitelisted Emails ({whitelist.length})
          </h3>
          
          {whitelist.length === 0 ? (
            <p className="text-slate-500 italic">No emails in whitelist</p>
          ) : (
            <div className="space-y-2">
              {whitelist.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-md border"
                >
                  <span className="text-slate-700">{email}</span>
                  <button
                    onClick={() => removeEmail(email)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhitelistManager;