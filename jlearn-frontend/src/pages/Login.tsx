import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, fullName, email: userEmail, role, userId } = response.data.data;
      const user = { userId, email: userEmail, fullName, role };
      login(accessToken, refreshToken, user);
      navigate('/dashboard');
    } catch (error) {
      alert('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-4">
            J
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Đăng nhập JLearn</h2>
          <p className="text-slate-500 mt-2">Học tiếng Nhật hiệu quả mỗi ngày</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="user@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/30"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};
