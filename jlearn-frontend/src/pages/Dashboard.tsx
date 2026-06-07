import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Book, CheckCircle, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Xin chào, {user?.fullName}! 👋</h1>
        <p className="text-slate-500 mt-2 text-lg">Tiếp tục hành trình chinh phục tiếng Nhật của bạn hôm nay.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Book size={24} />} title="Khóa học đang học" value="2" color="bg-blue-500" />
        <StatCard icon={<CheckCircle size={24} />} title="Bài học hoàn thành" value="15" color="bg-emerald-500" />
        <StatCard icon={<Clock size={24} />} title="Từ vựng cần ôn tập" value="42" color="bg-orange-500" />
        <StatCard icon={<Activity size={24} />} title="Bài kiểm tra đã làm" value="5" color="bg-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Hoạt động gần đây</h2>
          <div className="space-y-4">
            <ActivityItem title="Hoàn thành bài kiểm tra N5 - Bài 1" time="2 giờ trước" score="90%" />
            <ActivityItem title="Ôn tập 20 từ vựng SRS" time="Hôm qua" score="Tốt" />
            <ActivityItem title="Học ngữ pháp N5 - Bài 2" time="3 ngày trước" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
          <h2 className="text-xl font-bold mb-2">Sẵn sàng ôn tập?</h2>
          <p className="text-blue-100 mb-6">Bạn có 42 từ vựng đang chờ trong hàng đợi Spaced Repetition.</p>
          <a href="/reviews" className="block text-center w-full py-3 bg-white text-primary rounded-xl font-bold hover:bg-blue-50 transition-colors">
            Ôn tập ngay
          </a>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string, color: string }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${color} shadow-sm`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const ActivityItem = ({ title, time, score }: { title: string, time: string, score?: string }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
    <div>
      <h3 className="font-medium text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{time}</p>
    </div>
    {score && (
      <div className="px-3 py-1 bg-white rounded-lg text-sm font-bold text-primary border border-slate-200">
        {score}
      </div>
    )}
  </div>
);
