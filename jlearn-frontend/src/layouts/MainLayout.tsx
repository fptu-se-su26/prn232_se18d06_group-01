import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, BookOpen, Layers, Activity, User as UserIcon } from 'lucide-react';
import clsx from 'clsx';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar / Topnav */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-center md:justify-start gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
            J
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight hidden md:block">
            JLearn
          </span>
        </div>

        <nav className="flex-1 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
          <NavItem to="/dashboard" icon={<Activity size={20} />} label="Dashboard" />
          <NavItem to="/courses" icon={<BookOpen size={20} />} label="Khóa học" />
          <NavItem to="/reviews" icon={<Layers size={20} />} label="Ôn tập SRS" />
        </nav>

        {user && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <UserIcon size={20} />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-800">{user.fullName}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={() => logout()}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Đăng xuất"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <Outlet />
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => {
  return (
    <Link 
      to={to} 
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium whitespace-nowrap",
        "text-slate-600 hover:text-primary hover:bg-blue-50"
      )}
    >
      {icon}
      <span className="hidden md:block">{label}</span>
    </Link>
  );
};
