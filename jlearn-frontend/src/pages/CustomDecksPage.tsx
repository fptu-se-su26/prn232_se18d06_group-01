import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Plus, Trash2, Globe, Lock, Users } from 'lucide-react';

interface CustomDeck {
  deckId: number;
  userId: number;
  name: string;
  description: string | null;
  createdAt: string;
  totalCards: number;
  isPublic: boolean;
}

const CustomDecksPage: React.FC = () => {
  const { user } = useAuth();
  const [decks, setDecks] = useState<CustomDeck[]>([]);
  const [publicDecks, setPublicDecks] = useState<CustomDeck[]>([]);
  const [activeTab, setActiveTab] = useState<'my-decks' | 'community'>('my-decks');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchDecks = async () => {
    try {
      setLoading(true);
      setError(null);
      const [decksRes, publicRes] = await Promise.all([
        api.get('/custom-decks'),
        api.get('/custom-decks/public')
      ]);
      setDecks(decksRes.data.data || []);
      setPublicDecks(publicRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi lấy danh sách bộ thẻ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setFormSubmitting(true);
      setFormError(null);
      await api.post('/custom-decks', { 
        name: name.trim(), 
        description: description.trim(), 
        isPublic 
      });
      setName('');
      setDescription('');
      setIsPublic(false);
      setIsModalOpen(false);
      fetchDecks();
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Lỗi khi tạo bộ thẻ.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteDeck = async (deckId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Bạn có chắc chắn muốn xóa bộ thẻ này? Tất cả các thẻ bên trong cũng sẽ bị xóa.')) {
      return;
    }

    try {
      await api.delete(`/custom-decks/${deckId}`);
      fetchDecks();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Lỗi khi xóa bộ thẻ.');
    }
  };

  const filteredCommunityDecks = publicDecks.filter(d => d.userId !== user?.userId);
  const activeDecks = activeTab === 'my-decks' ? decks : filteredCommunityDecks;

  if (loading && decks.length === 0 && publicDecks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl tracking-tight">
              Học phần cá nhân
            </h1>
            <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
              Tạo, quản lý và chia sẻ các bộ thẻ từ vựng tự biên soạn.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/20 active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tạo bộ thẻ mới
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8">
          <button
            onClick={() => setActiveTab('my-decks')}
            className={`flex items-center gap-2 py-4 px-6 font-semibold border-b-2 transition-all text-sm sm:text-base ${
              activeTab === 'my-decks'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-350'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Bộ thẻ của tôi ({decks.length})
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex items-center gap-2 py-4 px-6 font-semibold border-b-2 transition-all text-sm sm:text-base ${
              activeTab === 'community'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-350'
            }`}
          >
            <Users className="w-4 h-4" />
            Bộ thẻ cộng đồng ({filteredCommunityDecks.length})
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-800/50 mb-8 font-medium">
            Lỗi: {error}
          </div>
        )}

        {activeDecks.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 shadow-sm">
            <BookOpen className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {activeTab === 'my-decks' ? 'Chưa có bộ thẻ nào' : 'Chưa có bộ thẻ cộng đồng nào'}
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {activeTab === 'my-decks'
                ? 'Hãy bắt đầu bằng cách tạo một bộ thẻ mới để tự nhập từ vựng ôn tập.'
                : 'Hiện chưa có người dùng khác chia sẻ bộ thẻ công khai.'}
            </p>
            {activeTab === 'my-decks' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tạo ngay
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeDecks.map((deck) => (
              <div 
                key={deck.deckId}
                onClick={() => navigate(`/decks/${deck.deckId}`)}
                className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-700/50 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 p-6 flex flex-col h-64 justify-between transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1.5 max-w-[80%]">
                      <h3 className="text-xl font-bold text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {deck.name}
                      </h3>
                      {activeTab === 'my-decks' ? (
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-450 dark:text-slate-400">
                          {deck.isPublic ? (
                            <span className="flex items-center text-emerald-600 dark:text-emerald-450 gap-0.5">
                              <Globe className="w-3.5 h-3.5" /> Công khai
                            </span>
                          ) : (
                            <span className="flex items-center text-slate-500 gap-0.5">
                              <Lock className="w-3.5 h-3.5" /> Riêng tư
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center text-xs font-medium text-slate-400 dark:text-slate-500">
                          Chia sẻ bởi thành viên khác
                        </span>
                      )}
                    </div>
                    {activeTab === 'my-decks' && (
                      <button
                        onClick={(e) => handleDeleteDeck(deck.deckId, e)}
                        className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Xóa bộ thẻ"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700/50 pt-4 flex items-center justify-between">
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <span className="block text-xl font-bold text-slate-800 dark:text-slate-200">{deck.totalCards}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Tổng số thẻ</span>
                    </div>
                  </div>

                  <span className="flex items-center px-4 py-2.5 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    Xem & Học
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal tạo bộ thẻ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            
            <div className="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-100 dark:border-slate-700">
              <form onSubmit={handleCreateDeck}>
                <div className="px-6 pt-6 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    Tạo bộ thẻ ôn tập mới
                  </h3>
                  
                  {formError && (
                    <div className="mb-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-100 dark:border-red-900/30">
                      {formError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Tên bộ thẻ *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ví dụ: Từ vựng Minna Bài 5, Kanji N3..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50 text-slate-950 dark:text-white transition-all text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mô tả chi tiết</label>
                      <textarea 
                        rows={3}
                        placeholder="Nhập mô tả về bộ thẻ ôn tập này..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50 text-slate-950 dark:text-white transition-all text-sm resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                      <input 
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                      />
                      <label htmlFor="isPublic" className="select-none text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer">
                        <Globe className="w-4 h-4 text-slate-400" />
                        Công khai bộ thẻ (Mọi người có thể xem và học)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 flex flex-row-reverse gap-3 border-t border-slate-100 dark:border-slate-700/50">
                  <button 
                    type="submit"
                    disabled={formSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95 shadow-md shadow-indigo-600/10"
                  >
                    {formSubmitting ? 'Đang lưu...' : 'Tạo mới'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDecksPage;
