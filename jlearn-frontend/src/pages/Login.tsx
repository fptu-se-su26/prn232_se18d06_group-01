import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { User, Mail, Lock, UserPlus, LogIn, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        // Handle Registration
        if (!fullName.trim()) {
          setErrorMessage('Vui lòng nhập họ và tên.');
          setLoading(false);
          return;
        }
        
        const response = await api.post('/auth/register', { 
          fullName: fullName.trim(), 
          email: email.trim(), 
          password 
        });

        const { accessToken, refreshToken, fullName: userFullName, email: userEmail, role, userId } = response.data.data;
        const userData = { userId, email: userEmail, fullName: userFullName, role };
        login(accessToken, refreshToken, userData);
        navigate('/dashboard');
      } else {
        // Handle Login
        const response = await api.post('/auth/login', { 
          email: email.trim(), 
          password 
        });

        const { accessToken, refreshToken, fullName: userFullName, email: userEmail, role, userId } = response.data.data;
        const userData = { userId, email: userEmail, fullName: userFullName, role };
        login(accessToken, refreshToken, userData);
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode: boolean) => {
    setIsRegisterMode(mode);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-800 transition-colors duration-300 space-y-6">
        
        {/* Header Logo & Title */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-lg shadow-indigo-600/20">
            J
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            {isRegisterMode ? 'Tạo tài khoản JLearn' : 'Đăng nhập JLearn'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            {isRegisterMode ? 'Bắt đầu hành trình học tiếng Nhật cá nhân' : 'Học từ vựng tiếng Nhật hiệu quả mỗi ngày'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
          <button
            type="button"
            onClick={() => switchMode(false)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              !isRegisterMode
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" /> Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => switchMode(true)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              isRegisterMode
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Đăng ký
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Họ và tên
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-semibold"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  required={isRegisterMode}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-semibold"
                placeholder="user@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
              Mật khẩu {isRegisterMode && '(Tối thiểu 6 ký tự)'}
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-semibold"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-95 cursor-pointer text-base mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : isRegisterMode ? (
              'Tạo tài khoản ngay'
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        {/* Footer Toggle Text */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isRegisterMode ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
            <button
              type="button"
              onClick={() => switchMode(!isRegisterMode)}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer ml-1"
            >
              {isRegisterMode ? 'Đăng nhập ngay' : 'Đăng ký tài khoản'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
