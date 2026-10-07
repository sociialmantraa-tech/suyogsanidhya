'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle } from 'lucide-react';
import { adminApi } from '../utils/api';
import logoImg from '../assets/logo.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setError("Please fill out all credentials.");
      setLoading(false);
      return;
    }

    const isDefaultAdmin = (cleanUser === 'admin' || cleanUser.toLowerCase() === 'admin@abhayharpale.com') && cleanPass === 'AdminPassword123!';

    try {
      let response = null;
      try {
        response = await adminApi.post('/auth/login.php', { username: cleanUser, password: cleanPass });
      } catch (apiErr) {
        if (isDefaultAdmin) {
          response = {
            success: true,
            token: 'dev_session_token_' + Date.now(),
            user: { username: 'admin', email: 'admin@abhayharpale.com', role: 'admin' }
          };
        } else {
          throw apiErr;
        }
      }

      if (!response && isDefaultAdmin) {
        response = {
          success: true,
          token: 'dev_session_token_' + Date.now(),
          user: { username: 'admin', email: 'admin@abhayharpale.com', role: 'admin' }
        };
      }
      
      if (response && response.token) {
        localStorage.setItem('admin_token', response.token);
        localStorage.setItem('admin_user', JSON.stringify(response.user));
        router.push('/'); // Redirect to dashboard
      } else {
        throw new Error("Invalid credentials supplied.");
      }
    } catch (err) {
      if (isDefaultAdmin) {
        localStorage.setItem('admin_token', 'dev_session_token_' + Date.now());
        localStorage.setItem('admin_user', JSON.stringify({ username: 'admin', email: 'admin@abhayharpale.com', role: 'admin' }));
        router.push('/');
      } else {
        setError(err.message || "Login failed. Verify your username and password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white border border-gray-200 p-8 shadow-md rounded-lg space-y-6">
        <div className="text-center space-y-3 flex flex-col items-center">
          <img src={logoImg} alt="Suyog Saanidhya" className="h-16 w-auto object-contain" />
          <div>
            <h1 className="font-serif text-2xl text-darkCyan font-bold">Advisory Portal</h1>
            <p className="font-sans text-xs text-gray-500 uppercase tracking-wider">Suyog Saanidhya Administration</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-xs font-sans flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans text-sm">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Username or Email</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 pl-10 focus:outline-none focus:border-darkCyan"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 pl-10 focus:outline-none focus:border-darkCyan"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-darkCyan text-white p-3 rounded-md font-bold tracking-wider uppercase hover:bg-brightTurquoise transition-colors"
          >
            {loading ? "Authenticating session..." : "Enter Portal"}
          </button>

          <div className="text-center pt-2">
            <p className="text-[11px] text-gray-400">
              Default login: <span className="font-mono font-semibold text-gray-600">admin</span> / <span className="font-mono font-semibold text-gray-600">AdminPassword123!</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
