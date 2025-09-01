'use client';

import { useState, useEffect, ReactNode } from 'react';

interface PasswordProtectionProps {
  children: ReactNode;
}

const CORRECT_PASSWORD = 'poulet'; // Change this to your desired password
const AUTH_KEY = 'thailand-dashboard-auth';

export default function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem(AUTH_KEY);
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'authenticated');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };


  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-5">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🍄🐔</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Mushroom & Chicken&apos;s Thailand Adventure
            </h1>
            <p className="text-gray-600">Enter password to access your private dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800"
                autoFocus
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Access Dashboard
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            🔒 Your authentication will be remembered on this device
          </div>
        </div>
      </div>
    );
  }

  // Show main content - logout is now handled in navigation
  return (
    <div className="relative">
      {children}
    </div>
  );
}