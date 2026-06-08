import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Flashcard from '../components/Flashcard';
import { ArrowLeft, ArrowRight, Eye, Keyboard } from 'lucide-react';

interface CustomCard {
  cardId: number;
  deckId: number;
  word: string;
  meaning: string;
}

interface CustomDeck {
  deckId: number;
  name: string;
  description: string | null;
}

const CustomPreviewDeckPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [deck, setDeck] = useState<CustomDeck | null>(null);
  const [cards, setCards] = useState<CustomCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch decks to find current deck info
      const decksResponse = await api.get('/custom-decks');
      const currentDeck = (decksResponse.data.data || []).find((d: any) => d.deckId === Number(id));
      setDeck(currentDeck || null);

      // Fetch ALL cards in the deck for free learning
      const cardsResponse = await api.get(`/custom-decks/${id}/cards`);
      setCards(cardsResponse.data.data || []);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Keyboard navigation helper
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cards.length === 0) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cards, currentIndex]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
      }, 150);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 150);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!deck || cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
        <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl max-w-sm w-full">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Không có thẻ học</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Vui lòng tạo hoặc import từ vựng vào bộ thẻ trước khi bắt đầu học tự do.</p>
          <Link to={`/decks/${id}`} className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-md">
            Quay lại bộ thẻ
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  
  // Mapping custom card data for Flashcard component
  const mappedVocabulary = {
    vocabId: currentCard.cardId,
    kanji: currentCard.word,
    kana: currentCard.word,
    meaning: currentCard.meaning
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300 flex flex-col justify-between">
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to={`/decks/${id}`} className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-1.5" />
            Thoát học tự do
          </Link>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Thẻ {currentIndex + 1} / {cards.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mb-10 overflow-hidden shadow-inner">
          <div 
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>

        {/* Immersive Study Card */}
        <div className="flex-1 flex items-center justify-center">
          <Flashcard 
            vocabulary={mappedVocabulary} 
            isFlipped={isFlipped} 
            onFlip={() => setIsFlipped(!isFlipped)} 
          />
        </div>

        {/* Navigation Toolbar */}
        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 w-full justify-between max-w-sm">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`p-4 rounded-full border transition-all duration-300 ${
                currentIndex === 0
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-655 cursor-not-allowed'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-250 active:scale-90 shadow-sm'
              }`}
              title="Thẻ trước"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-600/10 active:scale-95 transition-all text-base flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Lật thẻ (Space)
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className={`p-4 rounded-full border transition-all duration-300 ${
                currentIndex === cards.length - 1
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-655 cursor-not-allowed'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-250 active:scale-90 shadow-sm'
              }`}
              title="Thẻ sau"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700/30">
            <Keyboard className="w-4 h-4" />
            <span>Phím tắt:</span>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-sm">←/A</kbd> Trước
            <span className="mx-0.5">•</span>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-sm">→/D</kbd> Sau
            <span className="mx-0.5">•</span>
            <kbd className="px-3 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-sm">Space</kbd> Lật
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPreviewDeckPage;
