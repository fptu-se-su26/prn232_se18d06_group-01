import React, { useEffect, useState } from 'react';
import { ShieldAlert, Users, CreditCard, LayoutDashboard, Database, CheckCircle2, XCircle, Trash2, Shield, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { adminApi } from '../services/api';
import clsx from 'clsx';

type TabType = 'overview' | 'users' | 'decks';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [decks, setDecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const res = await adminApi.getStats();
        setStats(res.data.data);
      } else if (activeTab === 'users') {
        const res = await adminApi.getUsers();
        setUsers(res.data.data);
      } else if (activeTab === 'decks') {
        const res = await adminApi.getDecks();
        setDecks(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLock = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn khóa/mở khóa người dùng này?')) return;
    try {
      await adminApi.toggleLock(id);
      fetchData();
    } catch (err) {
      alert('Có lỗi xảy ra');
    }
  };

  const changeRole = async (id: number, currentRole: string) => {
    const newRole = currentRole === 'Admin' ? 'Learner' : 'Admin';
    if (!window.confirm(`Đổi vai trò thành ${newRole}?`)) return;
    try {
      await adminApi.changeRole(id, newRole);
      fetchData();
    } catch (err) {
      alert('Có lỗi xảy ra');
    }
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm('Xóa người dùng này vĩnh viễn?')) return;
    try {
      await adminApi.deleteUser(id);
      fetchData();
    } catch (err) {
      alert('Có lỗi xảy ra');
    }
  };

  const deleteDeck = async (id: number) => {
    if (!window.confirm('Xóa bộ thẻ này?')) return;
    try {
      await adminApi.deleteDeck(id);
      fetchData();
    } catch (err) {
      alert('Có lỗi xảy ra');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <ShieldAlert className="text-indigo-600 dark:text-indigo-400" size={32} />
            Bảng Điều Khiển Quản Trị
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Quản lý hệ thống, người dùng và bộ thẻ JLearn.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-fit mb-8">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18} />} label="Tổng quan" />
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18} />} label="Người dùng" />
        <TabButton active={activeTab === 'decks'} onClick={() => setActiveTab('decks')} icon={<Database size={18} />} label="Bộ thẻ" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'overview' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Tổng Người Dùng" value={stats.totalUsers} icon={<Users size={24} />} color="blue" />
              <StatCard title="Tổng Bộ Thẻ" value={stats.totalDecks} icon={<Database size={24} />} color="indigo" />
              <StatCard title="Tổng Thẻ Từ" value={stats.totalCards} icon={<CreditCard size={24} />} color="emerald" />
              <StatCard title="Bộ Thẻ Công Khai" value={stats.totalPublicDecks} icon={<Shield size={24} />} color="purple" />
              
              <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center">
                   <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Người dùng mới hôm nay</h3>
                   <span className="text-4xl font-black text-slate-800 dark:text-white">{stats.newUserToday}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center">
                   <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Người dùng mới (7 ngày)</h3>
                   <span className="text-4xl font-black text-slate-800 dark:text-white">{stats.newUsersLastWeek}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center">
                   <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Người dùng mới (30 ngày)</h3>
                   <span className="text-4xl font-black text-slate-800 dark:text-white">{stats.newUsersLastMonth}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                  <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-bold">Người dùng</th>
                      <th className="px-6 py-4 font-bold text-center">Vai trò</th>
                      <th className="px-6 py-4 font-bold text-center">Trạng thái</th>
                      <th className="px-6 py-4 font-bold text-center">Hoạt động</th>
                      <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 dark:text-white">{u.userFullName}</p>
                          <p className="text-xs opacity-70">{u.email}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={clsx("px-3 py-1 rounded-full text-xs font-bold", u.role === 'Admin' ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400")}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {u.isLocked ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-bold"><Lock size={14} /> Khóa</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-bold"><CheckCircle2 size={14} /> Hoạt động</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="text-xs">Decks: <b>{u.totalDecks}</b> | Cards: <b>{u.totalCards}</b></p>
                          <p className="text-xs">Quizzes: <b>{u.totalQuizAttempts}</b></p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => changeRole(u.userId || i, u.role)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/30 rounded-lg transition-colors" title="Đổi vai trò">
                              <Shield size={16} />
                            </button>
                            <button onClick={() => toggleLock(u.userId || i)} className="p-2 text-slate-400 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-amber-900/30 rounded-lg transition-colors" title={u.isLocked ? "Mở khóa" : "Khóa tài khoản"}>
                              {u.isLocked ? <Unlock size={16} /> : <Lock size={16} />}
                            </button>
                            <button onClick={() => deleteUser(u.userId || i)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Xóa người dùng">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'decks' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                  <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-bold">Bộ thẻ</th>
                      <th className="px-6 py-4 font-bold text-center">Tác giả</th>
                      <th className="px-6 py-4 font-bold text-center">Trạng thái</th>
                      <th className="px-6 py-4 font-bold text-center">Thẻ từ</th>
                      <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {decks.map((d, i) => (
                      <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 dark:text-white">{d.deckName}</p>
                          <p className="text-xs opacity-70 truncate max-w-xs">{d.description || 'Không có mô tả'}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="font-medium text-slate-800 dark:text-slate-300">{d.userFullName}</p>
                          <p className="text-xs opacity-70">{d.userEmail}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {d.isPublic ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full text-xs font-bold">Công khai</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 rounded-full text-xs font-bold">Riêng tư</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-slate-200">
                          {d.totalCards}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => deleteDeck(d.deckId)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Xóa bộ thẻ này">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 cursor-pointer",
      active 
        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm" 
        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
    )}
  >
    {icon}
    {label}
  </button>
);

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
      <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center", colors[color])}>
        {icon}
      </div>
      <div>
        <h3 className="text-slate-500 dark:text-slate-400 font-medium">{title}</h3>
        <span className="text-3xl font-black text-slate-800 dark:text-white">{value}</span>
      </div>
    </div>
  );
};
