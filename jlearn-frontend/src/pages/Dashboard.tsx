import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { BookOpen, Globe, FolderPlus, Compass, ArrowRight, Library, Layers, Sparkles } from 'lucide-react';

interface CustomDeck {
  deckId: number;
  userId: number;
  name: string;
  description: string | null;
  createdAt: string;
  totalCards: number;
  isPublic: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myDecks, setMyDecks] = useState<CustomDeck[]>([]);
  const [publicDecks, setPublicDecks] = useState<CustomDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cloningId, setCloningId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [myDecksRes, publicDecksRes] = await Promise.all([
        api.get('/custom-decks'),
        api.get('/custom-decks/public')
      ]);
      setMyDecks(myDecksRes.data.data || []);
      setPublicDecks(publicDecksRes.data.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Không thể lấy dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloneDeck = async (deckId: number, deckName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setCloningId(deckId);
      const response = await api.post(`/custom-decks/${deckId}/clone`);
      const clonedDeck = response.data.data;
      alert(`Sao chép thành công bộ thẻ "${deckName}" về thư viện cá nhân!`);
      navigate(`/decks/${clonedDeck.deckId}`);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Lỗi khi sao chép bộ thẻ.');
    } finally {
      setCloningId(null);
    }
  };

  // Calculate stats
  const totalMyDecks = myDecks.length;
  const totalPublicDecks = publicDecks.length;
  const totalCards = myDecks.reduce((sum, deck) => sum + deck.totalCards, 0);

  // Filter out community decks that are NOT created by the current user to display in "Khám phá"
  const communityDecks = publicDecks.filter(d => d.userId !== user?.userId);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-3xl w-2/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-56 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div className="h-56 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div className="h-56 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10 transition-colors duration-300">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="space-y-2 relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Xin chào, {user?.fullName || 'Học viên'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
            Hôm nay bạn muốn tích lũy thêm bao nhiêu từ vựng tiếng Nhật mới?
          </p>
        </div>
        <button
          onClick={() => navigate('/decks')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-95 transition-all relative z-10 self-start md:self-auto"
        >
          <Library className="w-5 h-5" />
          Học thẻ cá nhân
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />} 
          title="Học phần của tôi" 
          value={totalMyDecks} 
          subtitle="Bộ thẻ từ vựng tự tạo"
          color="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/30" 
        />
        <StatCard 
          icon={<Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />} 
          title="Tổng số thẻ từ" 
          value={totalCards} 
          subtitle="Từ vựng đang học"
          color="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30" 
        />
        <StatCard 
          icon={<Globe className="w-6 h-6 text-violet-600 dark:text-violet-400" />} 
          title="Bộ thẻ cộng đồng" 
          value={totalPublicDecks} 
          subtitle="Đã chia sẻ công khai"
          color="bg-violet-50 dark:bg-violet-950/30 border-violet-100 dark:border-violet-900/30" 
        />
      </section>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl font-semibold">
          Lỗi: {error}
        </div>
      )}

      {/* Explore Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Khám phá Bộ thẻ từ Cộng đồng
            </h2>
          </div>
          <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
            Học tập và sao chép dễ dàng
          </span>
        </div>

        {communityDecks.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 shadow-sm space-y-4">
            <Globe className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Chưa có bộ thẻ công khai nào khác</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Các bộ từ vựng được người dùng khác đặt ở chế độ Công khai sẽ xuất hiện tại đây để bạn khám phá.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityDecks.map((deck) => (
              <div 
                key={deck.deckId}
                onClick={() => navigate(`/decks/${deck.deckId}`)}
                className="group relative cursor-pointer bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-xl p-6 flex flex-col h-60 justify-between transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full">
                      <Globe className="w-3.5 h-3.5" /> Cộng đồng
                    </span>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                      {deck.totalCards} từ vựng
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {deck.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
                    {deck.description || 'Không có mô tả cho bộ thẻ này.'}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700/50 pt-4 flex items-center justify-between mt-4">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    ID Tác giả: #{deck.userId}
                  </span>
                  <button
                    onClick={(e) => handleCloneDeck(deck.deckId, deck.name, e)}
                    disabled={cloningId === deck.deckId}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-indigo-950/50 text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all active:scale-95"
                    title="Sao chép bộ thẻ này về thư viện cá nhân"
                  >
                    <FolderPlus className="w-4 h-4" />
                    {cloningId === deck.deckId ? 'Đang sao...' : 'Lưu bộ thẻ'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle, color }: { icon: React.ReactNode, title: string, value: number, subtitle: string, color: string }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border ${color} shadow-sm flex items-center gap-5 transition-all duration-300 hover:shadow-md`}>
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white dark:bg-slate-900 shadow-inner">
      {icon}
    </div>
    <div className="space-y-0.5">
      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-black text-slate-800 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  </div>
);

export default Dashboard;
