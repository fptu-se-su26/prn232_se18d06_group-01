import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User as UserIcon, BookMarked, Home, Sun, Moon, Compass } from 'lucide-react';
import clsx from 'clsx';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar / Topnav */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm transition-colors duration-300">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between md:justify-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/20">
              J
            </div>
            <span className="text-xl font-black text-slate-800 dark:text-white tracking-tight hidden md:block">
              JLearn
            </span>
          </div>
          {/* Mobile Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors md:hidden"
            title="Đổi giao diện"
          >
            {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
          <NavItem to="/dashboard" icon={<Home size={20} />} label="Trang chủ" />
          <NavItem to="/decks" icon={<BookMarked size={20} />} label="Thẻ cá nhân" />
          <NavItem to="/explore" icon={<Compass size={20} />} label="Khám phá" />
          
          {/* Desktop Theme Toggle at bottom of Nav */}
          <button
            onClick={toggleTheme}
            className="hidden md:flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left w-full mt-auto cursor-pointer"
          >
            {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
            <span>{isDark ? 'Giao diện sáng' : 'Giao diện tối'}</span>
          </button>
        </nav>

        {user && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                <UserIcon size={20} />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.fullName}</p>
                <p className="text-xs text-slate-550 dark:text-slate-400">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={() => logout()}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
              title="Đăng xuất"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50">
        <Outlet />
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));

  return (
    <Link 
      to={to} 
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold whitespace-nowrap",
        isActive 
          ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm"
          : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800"
      )}
    >
      {icon}
      <span className="hidden md:block">{label}</span>
    </Link>
  );
};

