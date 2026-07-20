import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Compass, Search, BookOpen, Copy, CheckCircle, User as UserIcon, Layers, ArrowRight, Sparkles } from 'lucide-react';

interface PublicDeck {
  deckId: number;
  userId: number;
  name: string;
  description: string | null;
  createdAt: string;
  totalCards: number;
  isPublic: boolean;
}

const ExplorePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [decks, setDecks] = useState<PublicDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cloning, setCloning] = useState<number | null>(null);
  const [clonedIds, setClonedIds] = useState<Set<number>>(new Set());

  const fetchPublicDecks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/custom-decks/public');
      setDecks(res.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách bộ thẻ cộng đồng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicDecks();
  }, []);

  const handleClone = async (deckId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (clonedIds.has(deckId)) return;

    try {
      setCloning(deckId);
      await api.post(`/custom-decks/${deckId}/clone`);
      setClonedIds(prev => new Set(prev).add(deckId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể sao chép bộ thẻ.');
    } finally {
      setCloning(null);
    }
  };

  // Filter: exclude own decks, apply search
  const filteredDecks = decks
    .filter(d => d.userId !== user?.userId)
    .filter(d => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return d.name.toLowerCase().includes(q) || 
             (d.description && d.description.toLowerCase().includes(q));
    });

  const ownPublicDecks = decks.filter(d => d.userId === user?.userId);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Đang tải bộ thẻ cộng đồng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* Hero Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Khám phá
            </h1>
          </div>
          <p className="text-lg text-slate-500 dark:text-slate-400 ml-[52px]">
            Duyệt và sao chép bộ thẻ từ vựng được chia sẻ bởi cộng đồng.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bộ thẻ theo tên hoặc mô tả..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-medium shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-bold cursor-pointer"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{filteredDecks.length}</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Bộ thẻ cộng đồng</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {filteredDecks.reduce((sum, d) => sum + d.totalCards, 0)}
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tổng số thẻ từ vựng</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{ownPublicDecks.length}</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Bộ thẻ bạn đã chia sẻ</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 mb-8 font-semibold text-sm">
            {error}
          </div>
        )}

        {/* Deck Grid */}
        {filteredDecks.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <Compass className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {searchQuery ? 'Không tìm thấy bộ thẻ phù hợp' : 'Chưa có bộ thẻ cộng đồng nào'}
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm">
              {searchQuery
                ? `Không có kết quả cho "${searchQuery}". Hãy thử từ khóa khác.`
                : 'Hiện chưa có ai chia sẻ bộ thẻ công khai. Hãy là người đầu tiên!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDecks.map((deck) => (
              <div
                key={deck.deckId}
                onClick={() => navigate(`/decks/${deck.deckId}`)}
                className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-400/50 dark:hover:border-indigo-500/40 p-6 flex flex-col justify-between h-72 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
              >
                {/* Top */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug flex-1 mr-3">
                      {deck.name}
                    </h3>
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                      <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>

                  {deck.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {deck.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>ID #{deck.userId}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>{formatDate(deck.createdAt)}</span>
                  </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <Layers className="w-3.5 h-3.5" />
                      {deck.totalCards} thẻ
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Clone Button */}
                    <button
                      onClick={(e) => handleClone(deck.deckId, e)}
                      disabled={cloning === deck.deckId || clonedIds.has(deck.deckId)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        clonedIds.has(deck.deckId)
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                          : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 active:scale-95'
                      } disabled:opacity-60`}
                    >
                      {cloning === deck.deckId ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-indigo-500 border-t-transparent" />
                      ) : clonedIds.has(deck.deckId) ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" /> Đã lưu
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Sao chép
                        </>
                      )}
                    </button>

                    {/* View Arrow */}
                    <span className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-300" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
