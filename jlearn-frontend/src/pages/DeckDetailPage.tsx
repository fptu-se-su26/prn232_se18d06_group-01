import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Sparkles, Edit, Trash2, ArrowLeft, Copy, Check, Info, BookOpen } from 'lucide-react';

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
  name: string;
  description: string | null;
}

const DeckDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [deck, setDeck] = useState<CustomDeck | null>(null);
  const [cards, setCards] = useState<CustomCard[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Card Form Modal
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CustomCard | null>(null);
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  
  // AI Import Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [inputList, setInputList] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [rawJsonInput, setRawJsonInput] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const fetchDeckDetails = async () => {
    try {
      setLoading(true);
      // Fetch decks to find current deck info
      const decksResponse = await api.get('/custom-decks');
      const currentDeck = (decksResponse.data.data || []).find((d: any) => d.deckId === Number(id));
      setDeck(currentDeck || null);

      // Fetch cards
      const cardsResponse = await api.get(`/custom-decks/${id}/cards`);
      setCards(cardsResponse.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeckDetails();
  }, [id]);

  // Generate Prompt whenever input list changes
  useEffect(() => {
    if (!inputList.trim()) {
      setGeneratedPrompt('');
      return;
    }
    const prompt = `Hãy tạo danh sách thẻ học từ danh sách sau dưới dạng JSON chuẩn. Mỗi phần tử có cấu trúc:
{
  "word": "từ vựng, khái niệm hoặc câu hỏi (LƯU Ý: Nếu là câu hỏi trắc nghiệm hoặc câu hỏi có các lựa chọn phương án A, B, C, D... thì bắt buộc phải giữ lại toàn bộ câu hỏi kèm danh sách tất cả các phương án lựa chọn đó ở đây, sử dụng dấu xuống dòng \\n để phân cách)",
  "meaning": "nghĩa của từ hoặc phương án đáp án đúng tương ứng"
}.
Chỉ trả về duy nhất chuỗi JSON thô dạng mảng, không bọc trong markdown (không có \`\`\`json), không giải thích gì thêm.

Danh sách nguồn:
${inputList.trim()}`;
    setGeneratedPrompt(prompt);
  }, [inputList]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleAiImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawJsonInput.trim()) return;

    try {
      setImportLoading(true);
      setImportError(null);
      await api.post(`/custom-decks/${id}/import`, { rawJson: rawJsonInput });
      setInputList('');
      setRawJsonInput('');
      setIsAiModalOpen(false);
      fetchDeckDetails();
    } catch (err: any) {
      setImportError(err.response?.data?.message || err.message || 'Nhập dữ liệu JSON thất bại. Vui lòng kiểm tra lại định dạng JSON.');
    } finally {
      setImportLoading(false);
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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Không tìm thấy bộ thẻ</h2>
          <Link to="/decks" className="mt-4 inline-flex items-center text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4">
          <Link to="/decks" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-indigo-400 hover:underline self-start">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Quay lại danh sách
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white sm:text-4xl tracking-tight">
                {deck.name}
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
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
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-indigo-500/10 active:scale-95"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Import từ AI
              </button>
              <button
                onClick={() => openCardModal()}
                className="flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 shadow-sm active:scale-95"
              >
                <Plus className="w-5 h-5 mr-2" />
                Thêm thẻ thủ công
              </button>
            </div>
          </div>
        </div>

        {/* Cards Table */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700/50">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/3">Từ khóa (Word)</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/3">Ý nghĩa (Meaning)</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cấp độ SRS</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lịch ôn tập</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700/50">
                {cards.map((card) => (
                  <tr key={card.cardId} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-indigo-650 dark:text-indigo-400">{card.word}</td>
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white max-w-md break-words" title={card.meaning}>{card.meaning}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        card.level === 5 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' :
                        card.level === 4 ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' :
                        card.level === 3 ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450' :
                        'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                      }`}>
                        Level {card.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                      {new Date(card.nextReviewDate) <= new Date() 
                        ? <span className="text-amber-500 dark:text-amber-400 font-bold">Cần ôn ngay</span>
                        : new Date(card.nextReviewDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                      <button
                        onClick={() => openCardModal(card)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4 inline-flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" /> Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card.cardId)}
                        className="text-red-500 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {cards.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-slate-400 dark:text-slate-500 font-medium">
                      Bộ thẻ chưa có từ vựng nào. Hãy chọn "Import từ AI" hoặc "Thêm thẻ thủ công" để bắt đầu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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

      {/* Modal Import từ AI */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={() => setIsAiModalOpen(false)}></div>
            
            <div className="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-slate-100 dark:border-slate-700">
              <form onSubmit={handleAiImport}>
                <div className="px-6 pt-6 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center mb-4">
                    <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
                    Quy trình Import nhanh bằng AI
                  </h3>
                  
                  {importError && (
                    <div className="mb-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-100 dark:border-red-900/30 font-medium">
                      {importError}
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* BƯỚC 1 */}
                    <div>
                      <span className="inline-block bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-2 py-0.5 rounded mb-1">BƯỚC 1</span>
                      <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                        Nhập danh sách của bạn (ví dụ copy từ Quizlet hoặc định dạng `Từ : Ý nghĩa`):
                      </label>
                      <textarea
                        rows={3}
                        placeholder="勉強する : học tập&#10;猫 : con mèo"
                        value={inputList}
                        onChange={(e) => setInputList(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50 text-slate-950 dark:text-white transition-all text-sm resize-none font-mono"
                      />
                    </div>

                    {/* BƯỚC 2 */}
                    {generatedPrompt && (
                      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 relative">
                        <div className="flex justify-between items-center mb-2">
                          <span className="inline-block bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-2 py-0.5 rounded">BƯỚC 2</span>
                          <button
                            type="button"
                            onClick={handleCopyPrompt}
                            className="flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                          >
                            {copiedPrompt ? (
                              <>
                                <Check className="w-3.5 h-3.5 mr-1" /> Đã copy
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 mr-1" /> Copy Prompt gửi AI
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed flex items-start">
                          <Info className="w-4 h-4 mr-1.5 flex-shrink-0 text-slate-400" />
                          Copy đoạn prompt và dán vào ChatGPT/Gemini để sinh chuỗi JSON rút gọn gồm Word và Meaning.
                        </p>
                        <pre className="text-xs text-slate-600 dark:text-slate-350 overflow-y-auto max-h-24 whitespace-pre-wrap font-mono leading-relaxed select-all">
                          {generatedPrompt}
                        </pre>
                      </div>
                    )}

                    {/* BƯỚC 3 */}
                    <div>
                      <span className="inline-block bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-2 py-0.5 rounded mb-1">BƯỚC 3</span>
                      <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                        Dán kết quả JSON nhận được từ AI vào đây để hoàn tất:
                      </label>
                      <textarea
                        rows={4}
                        placeholder='[&#10;  { "word": "勉強する", "meaning": "học tập" },&#10;  { "word": "猫", "meaning": "con mèo" }&#10;]'
                        value={rawJsonInput}
                        onChange={(e) => setRawJsonInput(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50 text-slate-950 dark:text-white transition-all text-sm resize-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 flex flex-row-reverse gap-3 border-t border-slate-100 dark:border-slate-700/50">
                  <button 
                    type="submit"
                    disabled={importLoading || !rawJsonInput.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95 shadow-md shadow-indigo-600/10"
                  >
                    {importLoading ? 'Đang import...' : 'Xác nhận Import'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsAiModalOpen(false)}
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
