import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Sparkles, Trash2, ArrowLeft, Check, Info, BookOpen, Globe, Lock, Settings, FolderHeart, HelpCircle, Trophy, Volume2 } from 'lucide-react';
import { speakJapanese } from '../utils/speech';

interface CustomCard {
  cardId: number;
  deckId: number;
  word: string;
  meaning: string;
  level: number;
  nextReviewDate: string;
}

interface CustomDeck {
  deckId: number;
  userId: number;
  name: string;
  description: string | null;
  isPublic: boolean;
}

interface QuizResult {
  quizResultId: number;
  quizType: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  completedAt: string;
}

const DeckDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [deck, setDeck] = useState<CustomDeck | null>(null);
  const [cards, setCards] = useState<CustomCard[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Deck Edit Form Modal
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [deckIsPublic, setDeckIsPublic] = useState(false);
  const [deckSubmitting, setDeckSubmitting] = useState(false);

  // Card Form Modal
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CustomCard | null>(null);
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  
  // CSV Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvInput, setCsvInput] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const [cloning, setCloning] = useState(false);

  // Inline editing states
  const [editStates, setEditStates] = useState<{[key: number]: { word: string, meaning: string }}>({});
  const [savingCardId, setSavingCardId] = useState<number | null>(null);

  const fetchDeckDetails = async () => {
    try {
      setLoading(true);
      // Fetch single deck detail
      const deckResponse = await api.get(`/custom-decks/${id}`);
      setDeck(deckResponse.data.data);

      // Fetch cards inside this deck
      const cardsResponse = await api.get(`/custom-decks/${id}/cards`);
      setCards(cardsResponse.data.data || []);

      // Fetch quiz history for this deck
      try {
        const historyResponse = await api.get(`/custom-decks/${id}/quiz-results`);
        setQuizHistory(historyResponse.data.data || []);
      } catch (e) {
        // Silent catch if no history
      }
    } catch (err) {
      console.error(err);
      setDeck(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeckDetails();
  }, [id]);

  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvInput.trim()) return;

    try {
      setImportLoading(true);
      setImportError(null);
      await api.post(`/custom-decks/${id}/import`, { content: csvInput });
      setCsvInput('');
      setIsImportModalOpen(false);
      fetchDeckDetails();
    } catch (err: any) {
      setImportError(err.response?.data?.message || err.message || 'Nhập dữ liệu thất bại. Vui lòng kiểm tra lại định dạng CSV.');
    } finally {
      setImportLoading(false);
    }
  };

  const handleFieldChange = (cardId: number, field: 'word' | 'meaning', value: string) => {
    setEditStates(prev => {
      const current = prev[cardId] || { 
        word: cards.find(c => c.cardId === cardId)?.word || '', 
        meaning: cards.find(c => c.cardId === cardId)?.meaning || '' 
      };
      return {
        ...prev,
        [cardId]: {
          ...current,
          [field]: value
        }
      };
    });
  };

  const hasChanges = (cardId: number) => {
    const edit = editStates[cardId];
    if (!edit) return false;
    const original = cards.find(c => c.cardId === cardId);
    if (!original) return false;
    return edit.word.trim() !== original.word.trim() || edit.meaning.trim() !== original.meaning.trim();
  };

  const handleInlineSave = async (cardId: number) => {
    const edit = editStates[cardId];
    if (!edit) return;
    if (!edit.word.trim() || !edit.meaning.trim()) {
      alert('Từ khóa và ý nghĩa không được để trống.');
      return;
    }

    try {
      setSavingCardId(cardId);
      await api.put(`/custom-decks/${id}/cards/${cardId}`, {
        word: edit.word.trim(),
        meaning: edit.meaning.trim()
      });
      
      // Update the local card list
      setCards(prev => prev.map(c => c.cardId === cardId ? { ...c, word: edit.word.trim(), meaning: edit.meaning.trim() } : c));
      
      // Clean up edit state
      setEditStates(prev => {
        const copy = { ...prev };
        delete copy[cardId];
        return copy;
      });
    } catch (err) {
      alert('Lỗi khi lưu thẻ từ vựng.');
    } finally {
      setSavingCardId(null);
    }
  };

  const openDeckEditModal = () => {
    if (!deck) return;
    setDeckName(deck.name);
    setDeckDescription(deck.description || '');
    setDeckIsPublic(deck.isPublic);
    setIsDeckModalOpen(true);
  };

  const handleDeckEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckName.trim()) return;

    try {
      setDeckSubmitting(true);
      const response = await api.put(`/custom-decks/${id}`, {
        name: deckName.trim(),
        description: deckDescription.trim(),
        isPublic: deckIsPublic
      });
      setDeck(response.data.data);
      setIsDeckModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Lỗi khi cập nhật bộ thẻ.');
    } finally {
      setDeckSubmitting(false);
    }
  };

  const openCardModal = (card?: CustomCard) => {
    if (card) {
      setEditingCard(card);
      setWord(card.word);
      setMeaning(card.meaning);
    } else {
      setEditingCard(null);
      setWord('');
      setMeaning('');
    }
    setIsCardModalOpen(true);
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !meaning.trim()) return;

    const payload = {
      word: word.trim(),
      meaning: meaning.trim()
    };

    try {
      if (editingCard) {
        await api.put(`/custom-decks/${id}/cards/${editingCard.cardId}`, payload);
      } else {
        await api.post(`/custom-decks/${id}/cards`, payload);
      }
      setIsCardModalOpen(false);
      fetchDeckDetails();
    } catch (err) {
      alert('Lỗi khi lưu thẻ từ vựng.');
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thẻ này?')) return;

    try {
      await api.delete(`/custom-decks/${id}/cards/${cardId}`);
      fetchDeckDetails();
    } catch (err) {
      alert('Lỗi khi xóa thẻ.');
    }
  };

  const handleCloneDeck = async () => {
    if (!deck) return;
    try {
      setCloning(true);
      const response = await api.post(`/custom-decks/${id}/clone`);
      const clonedDeck = response.data.data;
      alert(`Sao chép thành công bộ thẻ "${deck.name}" về thư viện của bạn!`);
      navigate(`/decks/${clonedDeck.deckId}`);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Lỗi khi sao chép bộ thẻ.');
    } finally {
      setCloning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl max-w-sm">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Không tìm thấy bộ thẻ</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Bộ thẻ có thể đã bị xóa hoặc là riêng tư.</p>
          <Link to="/decks" className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-md">
            <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = deck.userId === user?.userId;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4">
          <Link to="/decks" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-indigo-400 hover:underline self-start">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Quay lại danh sách
          </Link>
          
          {/* Public Notice for Non-owner */}
          {!isOwner && (
            <div className="flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-350 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 text-sm font-medium">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-indigo-500" />
              <div>
                <p className="font-bold">Bạn đang xem học phần công khai của thành viên khác</p>
                <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400">
                  Bạn có thể học tự do (Flashcard) hoặc làm trắc nghiệm trực tiếp. Để bắt đầu tự do thêm, sửa, xóa thẻ từ vựng và sở hữu bộ thẻ này, vui lòng nhấn <b>"Lưu về thư viện"</b> bên phải.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white sm:text-4xl tracking-tight">
                  {deck.name}
                </h1>
                <div className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {deck.isPublic ? (
                    <>
                      <Globe className="w-3.5 h-3.5 text-emerald-500" />
                      Công khai
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      Riêng tư
                    </>
                  )}
                </div>
              </div>
              <p className="mt-3 text-slate-600 dark:text-slate-300">
                {deck.description || 'Không có mô tả cho bộ thẻ này.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/decks/${id}/preview`}
                className={`flex items-center justify-center px-5 py-3 rounded-xl font-bold transition-all duration-300 shadow-md active:scale-95 ${
                  cards.length === 0
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed pointer-events-none shadow-none border border-slate-200 dark:border-slate-700'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/10'
                }`}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Học tự do
              </Link>

              <Link
                to={`/decks/${id}/quiz`}
                className={`flex items-center justify-center px-5 py-3 rounded-xl font-bold transition-all duration-300 shadow-md active:scale-95 ${
                  cards.length < 4
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed pointer-events-none shadow-none border border-slate-200 dark:border-slate-700'
                    : 'bg-indigo-50 hover:bg-indigo-100/70 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 shadow-sm'
                }`}
                title={cards.length < 4 ? 'Cần ít nhất 4 từ vựng để bắt đầu trắc nghiệm' : 'Bắt đầu kiểm tra trắc nghiệm'}
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Kiểm tra (Quiz)
              </Link>

              {isOwner ? (
                <>
                  <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-indigo-500/10 active:scale-95"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Import từ CSV
                  </button>
                  <button
                    onClick={() => openCardModal()}
                    className="flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 shadow-sm active:scale-95"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Thêm thẻ thủ công
                  </button>
                  <button
                    onClick={openDeckEditModal}
                    className="flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 p-3 rounded-xl font-bold transition-all duration-300 shadow-sm active:scale-95"
                    title="Chỉnh sửa bộ thẻ"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCloneDeck}
                  disabled={cloning}
                  className="flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 shadow-md active:scale-95 disabled:from-slate-400 disabled:to-slate-500"
                >
                  <FolderHeart className="w-5 h-5 mr-2" />
                  {cloning ? 'Đang lưu...' : 'Lưu về thư viện'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recent Quiz History */}
        {quizHistory.length > 0 && (
          <div className="mb-8 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/50 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Lịch sử làm bài trắc nghiệm gần đây
              </h3>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                {quizHistory.length} lượt làm bài
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {quizHistory.slice(0, 3).map((res) => (
                <div key={res.quizResultId} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded uppercase">
                      {res.quizType}
                    </span>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {new Date(res.completedAt).toLocaleDateString('vi-VN')} {new Date(res.completedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-black ${res.scorePercentage >= 80 ? 'text-amber-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                      {res.scorePercentage}%
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {res.correctAnswers}/{res.totalQuestions} đúng
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cards Table */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700/50">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th scope="col" className={`px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${isOwner ? 'w-5/12' : 'w-1/2'}`}>Từ khóa (Word)</th>
                  <th scope="col" className={`px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${isOwner ? 'w-5/12' : 'w-1/2'}`}>Ý nghĩa (Meaning)</th>
                  {isOwner && <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-2/12">Hành động</th>}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700/50">
                {cards.map((card) => (
                  <tr key={card.cardId} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => speakJapanese(editStates[card.cardId]?.word ?? card.word, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors flex-shrink-0 cursor-pointer"
                          title="Phát âm"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        {isOwner ? (
                          <input 
                            type="text" 
                            value={editStates[card.cardId]?.word ?? card.word}
                            onChange={(e) => handleFieldChange(card.cardId, 'word', e.target.value)}
                            className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-slate-50 dark:focus:bg-slate-900 px-2 py-1 rounded transition-all outline-none text-indigo-600 dark:text-indigo-400 font-bold"
                          />
                        ) : (
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold px-2 py-1">{card.word}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      {isOwner ? (
                        <input 
                          type="text" 
                          value={editStates[card.cardId]?.meaning ?? card.meaning}
                          onChange={(e) => handleFieldChange(card.cardId, 'meaning', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-slate-50 dark:focus:bg-slate-900 px-2 py-1 rounded transition-all outline-none text-slate-900 dark:text-white"
                        />
                      ) : (
                        <span className="text-slate-900 dark:text-white px-2 py-1 block max-w-md break-words">{card.meaning}</span>
                      )}
                    </td>
                    {isOwner && (
                      <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-semibold">
                        {hasChanges(card.cardId) && (
                          <button
                            onClick={() => handleInlineSave(card.cardId)}
                            disabled={savingCardId === card.cardId}
                            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-350 mr-4 inline-flex items-center font-bold"
                          >
                            <Check className="w-4 h-4 mr-1" /> Save
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCard(card.cardId)}
                          className="text-red-500 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 inline-flex items-center font-bold"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Xóa
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {cards.length === 0 && (
                  <tr>
                    <td colSpan={isOwner ? 3 : 2} className="px-6 py-16 text-center text-slate-400 dark:text-slate-500 font-medium">
                      {isOwner 
                        ? 'Bộ thẻ chưa có từ vựng nào. Hãy chọn "Import từ CSV" hoặc "Thêm thẻ thủ công" để bắt đầu.'
                        : 'Bộ thẻ này hiện chưa có nội dung.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Chỉnh sửa Bộ Thẻ (Deck Edit Modal) */}
      {isDeckModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={() => setIsDeckModalOpen(false)}></div>
            
            <div className="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-100 dark:border-slate-700">
              <form onSubmit={handleDeckEditSubmit}>
                <div className="px-6 pt-6 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    Chỉnh sửa thông tin học phần
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Tên bộ thẻ *</label>
                      <input 
                        type="text" 
                        required
                        value={deckName}
                        onChange={(e) => setDeckName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50 text-slate-950 dark:text-white transition-all text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mô tả chi tiết</label>
                      <textarea 
                        rows={3}
                        value={deckDescription}
                        onChange={(e) => setDeckDescription(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50 text-slate-950 dark:text-white transition-all text-sm resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                      <input 
                        type="checkbox"
                        id="editIsPublic"
                        checked={deckIsPublic}
                        onChange={(e) => setDeckIsPublic(e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                      />
                      <label htmlFor="editIsPublic" className="select-none text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer">
                        <Globe className="w-4 h-4 text-slate-400" />
                        Công khai bộ thẻ (Mọi người có thể xem và học)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 flex flex-row-reverse gap-3 border-t border-slate-100 dark:border-slate-700/50">
                  <button 
                    type="submit"
                    disabled={deckSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95 shadow-md shadow-indigo-600/10"
                  >
                    {deckSubmitting ? 'Đang lưu...' : 'Lưu lại'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsDeckModalOpen(false)}
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

      {/* Modal CRUD Card */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={() => setIsCardModalOpen(false)}></div>
            
            <div className="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-100 dark:border-slate-700">
              <form onSubmit={handleCardSubmit}>
                <div className="px-6 pt-6 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    {editingCard ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Từ khóa (Word) *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Nhập từ chính, ví dụ: 勉強する hoặc 猫"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50 text-slate-950 dark:text-white transition-all text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Ý nghĩa (Meaning) *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Nhập ý nghĩa, ví dụ: học tập hoặc con mèo"
                        value={meaning}
                        onChange={(e) => setMeaning(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50 text-slate-950 dark:text-white transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 flex flex-row-reverse gap-3 border-t border-slate-100 dark:border-slate-700/50">
                  <button 
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95 shadow-md shadow-indigo-600/10"
                  >
                    Lưu lại
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsCardModalOpen(false)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Import từ CSV */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={() => setIsImportModalOpen(false)}></div>
            
            <div className="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-slate-100 dark:border-slate-700">
              <form onSubmit={handleCsvImport}>
                <div className="px-6 pt-6 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center mb-4">
                    <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
                    Nhập nhanh từ CSV
                  </h3>
                  
                  {importError && (
                    <div className="mb-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-100 dark:border-red-900/30 font-medium">
                      {importError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed flex items-start">
                        <Info className="w-4.5 h-4.5 mr-1.5 flex-shrink-0 text-indigo-500" />
                        <span>
                          Dán dữ liệu CSV ngăn cách bởi dấu phẩy. Dòng đầu tiên có thể là tiêu đề <code>"question","answer"</code>. 
                          Mỗi dòng tiếp theo đại diện cho một thẻ gồm 2 trường được bọc trong dấu ngoặc kép.
                        </span>
                      </p>
                      <textarea
                        rows={10}
                        placeholder={`"question","answer"\n"一","Nhất (số 1)"\n"右","Hữu (bên phải)"`}
                        value={csvInput}
                        onChange={(e) => setCsvInput(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50 text-slate-950 dark:text-white transition-all text-sm resize-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 flex flex-row-reverse gap-3 border-t border-slate-100 dark:border-slate-700/50">
                  <button 
                    type="submit"
                    disabled={importLoading || !csvInput.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95 shadow-md shadow-indigo-600/10"
                  >
                    {importLoading ? 'Đang import...' : 'Xác nhận Import'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsImportModalOpen(false)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                  >
                    Hủy
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

export default DeckDetailPage;
