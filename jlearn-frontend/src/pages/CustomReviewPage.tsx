import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Flashcard from '../components/Flashcard';
import { ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';

interface CustomCard {
  cardId: number;
  deckId: number;
  kanji: string | null;
  hira: string | null;
  kana: string;
  meaning: string;
  romaji: string | null;
  level: number;
  nextReviewDate: string;
}

const CustomReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cards, setCards] = useState<CustomCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const fetchDueCards = async () => {
    try {
      setLoading(true);
      setCompleted(false);
      setCurrentIndex(0);
      setIsFlipped(false);
      const response = await api.get(`/custom-decks/${id}/reviews`);
      setCards(response.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueCards();
  }, [id]);

  const handleReview = async (rating: number) => {
    if (submitting || cards.length === 0) return;

    const currentCard = cards[currentIndex];
    try {
      setSubmitting(true);
      // Gọi API nộp kết quả đánh giá thẻ ôn tập
      await api.post(`/custom-decks/${id}/review`, {
        cardId: currentCard.cardId,
        rating: rating
      });

      setIsFlipped(false);
      // Chờ animation quay thẻ hoàn tất trước khi đổi sang thẻ khác
      setTimeout(() => {
        if (currentIndex < cards.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setCompleted(true);
        }
        setSubmitting(false);
      }, 300);

    } catch (err) {
      alert('Gửi kết quả ôn tập thất bại.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Kết thúc ôn tập
  if (completed || cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-xl text-center">
          <CheckCircle className="mx-auto h-20 w-20 text-emerald-500 mb-6" />
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Đã hoàn thành!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Bạn đã ôn tập xong tất cả các thẻ đến hạn của bộ này ngày hôm nay. Tiếp tục phát huy nhé!
          </p>
          <div className="space-y-3">
            <Link
              to="/decks"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/10 active:scale-95"
            >
              Quay lại danh sách bộ thẻ
            </Link>
            <button
              onClick={fetchDueCards}
              className="w-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-3 px-4 rounded-xl transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tải lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  
  // Ánh xạ kiểu dữ liệu sang cấu trúc mong đợi của component Flashcard
  const mappedVocabulary = {
    vocabId: currentCard.cardId,
    kanji: currentCard.kanji || undefined,
    hira: currentCard.hira || undefined,
    kana: currentCard.kana,
    romaji: currentCard.romaji || undefined,
    meaning: currentCard.meaning
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300 flex flex-col justify-between">
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to={`/decks/${id}`} className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-1.5" />
            Thoát ôn tập
          </Link>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Thẻ {currentIndex + 1} / {cards.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mb-10 overflow-hidden shadow-inner">
          <div 
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex) / cards.length) * 100}%` }}
          />
        </div>

        {/* Flashcard */}
        <div className="flex-1 flex items-center justify-center">
          <Flashcard 
            vocabulary={mappedVocabulary} 
            isFlipped={isFlipped} 
            onFlip={() => setIsFlipped(!isFlipped)} 
          />
        </div>

        {/* Action / Evaluation Buttons */}
        <div className="mt-10 min-h-24 flex items-center justify-center">
          {!isFlipped ? (
            <button
              onClick={() => setIsFlipped(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-600/10 active:scale-95 transition-all text-base animate-bounce"
            >
              Lật thẻ xem nghĩa
            </button>
          ) : (
            <div className="w-full flex flex-col items-center">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
                Đánh giá mức độ nhớ của bạn:
              </p>
              <div className="grid grid-cols-5 gap-2 w-full">
                <button
                  onClick={() => handleReview(1)}
                  disabled={submitting}
                  className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 border border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 font-bold py-3 px-1 rounded-xl text-xs md:text-sm active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-lg">1</span>
                  <span>Quên</span>
                </button>
                <button
                  onClick={() => handleReview(2)}
                  disabled={submitting}
                  className="bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-900/30 border border-orange-200 dark:border-orange-800/50 text-orange-600 dark:text-orange-400 font-bold py-3 px-1 rounded-xl text-xs md:text-sm active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-lg">2</span>
                  <span>Mơ hồ</span>
                </button>
                <button
                  onClick={() => handleReview(3)}
                  disabled={submitting}
                  className="bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-450 font-bold py-3 px-1 rounded-xl text-xs md:text-sm active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-lg">3</span>
                  <span>Tàm tạm</span>
                </button>
                <button
                  onClick={() => handleReview(4)}
                  disabled={submitting}
                  className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 font-bold py-3 px-1 rounded-xl text-xs md:text-sm active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-lg">4</span>
                  <span>Nhớ tốt</span>
                </button>
                <button
                  onClick={() => handleReview(5)}
                  disabled={submitting}
                  className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 font-bold py-3 px-1 rounded-xl text-xs md:text-sm active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-lg">5</span>
                  <span>Hoàn hảo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomReviewPage;
