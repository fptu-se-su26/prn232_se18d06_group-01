import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Check, X, Award, RotateCcw, HelpCircle, Trophy, Play, CheckCircle2, AlertTriangle } from 'lucide-react';

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

interface Question {
  cardId: number;
  type: 'jp-vi' | 'vi-jp';
  prompt: string;
  correctAnswer: string;
  options: string[];
  originalCard: CustomCard;
}

interface WrongAnswer {
  question: Question;
  chosenAnswer: string;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const DeckQuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [deck, setDeck] = useState<CustomDeck | null>(null);
  const [cards, setCards] = useState<CustomCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Game States
  const [gameState, setGameState] = useState<'config' | 'playing' | 'summary'>('config');
  const [quizType, setQuizType] = useState<'jp-vi' | 'vi-jp' | 'mixed'>('jp-vi');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Play States
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [isSavingScore, setIsSavingScore] = useState(false);
  const [isSavedScore, setIsSavedScore] = useState(false);

  useEffect(() => {
    const fetchDeckAndCards = async () => {
      try {
        setLoading(true);
        setError(null);
        const [deckRes, cardsRes] = await Promise.all([
          api.get(`/custom-decks/${id}`),
          api.get(`/custom-decks/${id}/cards`)
        ]);
        setDeck(deckRes.data.data);
        setCards(cardsRes.data.data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || err.message || 'Không thể lấy thông tin bộ thẻ.');
      } finally {
        setLoading(false);
      }
    };
    fetchDeckAndCards();
  }, [id]);

  const generateQuiz = (type: 'jp-vi' | 'vi-jp' | 'mixed') => {
    if (cards.length < 4) {
      alert('Bộ thẻ cần ít nhất 4 từ vựng để bắt đầu trắc nghiệm.');
      return;
    }

    const shuffledCards = shuffleArray(cards);
    const quizQuestions: Question[] = shuffledCards.map((card) => {
      // Determine question type
      let qType: 'jp-vi' | 'vi-jp' = 'jp-vi';
      if (type === 'vi-jp') {
        qType = 'vi-jp';
      } else if (type === 'mixed') {
        qType = Math.random() > 0.5 ? 'jp-vi' : 'vi-jp';
      }

      const prompt = qType === 'jp-vi' ? card.word : card.meaning;
      const correctAnswer = qType === 'jp-vi' ? card.meaning : card.word;

      // Select 3 distractors
      const otherCards = cards.filter((c) => c.cardId !== card.cardId);
      const shuffledOthers = shuffleArray(otherCards);
      
      const distractors = new Set<string>();
      for (const otherCard of shuffledOthers) {
        const value = qType === 'jp-vi' ? otherCard.meaning : otherCard.word;
        if (value.trim().toLowerCase() !== correctAnswer.trim().toLowerCase()) {
          distractors.add(value);
        }
        if (distractors.size === 3) break;
      }

      // Fallback in case of duplicate text values in cards
      while (distractors.size < 3) {
        distractors.add(`Đáp án nhiễu ${distractors.size + 1}`);
      }

      const options = shuffleArray([correctAnswer, ...Array.from(distractors)]);

      return {
        cardId: card.cardId,
        type: qType,
        prompt,
        correctAnswer,
        options,
        originalCard: card
      };
    });

    setQuestions(quizQuestions);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setWrongCount(0);
    setWrongAnswers([]);
    setIsSavedScore(false);
    setIsSavingScore(false);
    setGameState('playing');
  };

  const saveQuizScore = async (finalCorrectCount: number, finalTotalCount: number) => {
    try {
      setIsSavingScore(true);
      await api.post(`/custom-decks/${id}/quiz-results`, {
        quizType,
        totalQuestions: finalTotalCount,
        correctAnswers: finalCorrectCount
      });
      setIsSavedScore(true);
    } catch (err) {
      console.error('Lỗi khi lưu kết quả bài test:', err);
    } finally {
      setIsSavingScore(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQuestion = questions[currentIdx];
    const isCorrect = option === currentQuestion.correctAnswer;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
      setWrongAnswers((prev) => [...prev, {
        question: currentQuestion,
        chosenAnswer: option
      }]);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      saveQuizScore(correctCount, questions.length);
      setGameState('summary');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="text-center bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl max-w-sm w-full space-y-4">
          <AlertTriangle className="mx-auto h-12 w-12 text-rose-500" />
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Lỗi xảy ra</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{error || 'Không tìm thấy bộ thẻ.'}</p>
          <Link to="/decks" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  // Render State: Configuration
  if (gameState === 'config') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-2xl mx-auto space-y-8">
          <Link to={`/decks/${id}`} className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-1.5" />
            Thoát trắc nghiệm
          </Link>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-300">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                Chế độ Kiểm tra
              </span>
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight pt-2">
                Trắc nghiệm: {deck.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Tổng số từ vựng trong bộ thẻ: <span className="font-bold text-slate-700 dark:text-slate-300">{cards.length} thẻ</span>
              </p>
            </div>

            {cards.length < 4 ? (
              <div className="p-5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Không đủ từ vựng để bắt đầu</p>
                  <p className="mt-1">Tính năng trắc nghiệm yêu cầu bộ thẻ của bạn phải có **ít nhất 4 thẻ từ vựng** để làm các phương án trả lời nhiễu. Vui lòng thêm từ vựng và quay lại sau.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-300">
                    Chọn chế độ trắc nghiệm:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <ConfigOption 
                      active={quizType === 'jp-vi'}
                      onClick={() => setQuizType('jp-vi')}
                      title="Nhật ➔ Việt"
                      desc="Đưa ra từ chữ Nhật, chọn nghĩa tiếng Việt"
                    />
                    <ConfigOption 
                      active={quizType === 'vi-jp'}
                      onClick={() => setQuizType('vi-jp')}
                      title="Việt ➔ Nhật"
                      desc="Đưa ra nghĩa tiếng Việt, chọn từ chữ Nhật"
                    />
                    <ConfigOption 
                      active={quizType === 'mixed'}
                      onClick={() => setQuizType('mixed')}
                      title="Trộn lẫn"
                      desc="Kết hợp ngẫu nhiên cả hai dạng câu hỏi"
                    />
                  </div>
                </div>

                <button
                  onClick={() => generateQuiz(quizType)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Bắt đầu kiểm tra
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render State: Playing
  if (gameState === 'playing' && questions.length > 0) {
    const currentQuestion = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => {
                if (window.confirm('Tiến trình kiểm tra hiện tại sẽ bị mất. Bạn có muốn thoát?')) {
                  setGameState('config');
                }
              }}
              className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1.5" />
              Hủy kiểm tra
            </button>
            <div className="flex gap-4 text-sm font-bold">
              <span className="text-emerald-600 dark:text-emerald-400">Đúng: {correctCount}</span>
              <span className="text-rose-500 dark:text-rose-400">Sai: {wrongCount}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400 dark:text-slate-500">
              <span>CÂU HỎI {currentIdx + 1} / {questions.length}</span>
              <span>{Math.round(progress)}% HOÀN THÀNH</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 flex flex-col items-center transition-colors duration-300">
            <div className="text-center space-y-3 w-full">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700/30">
                <HelpCircle className="w-3.5 h-3.5" /> 
                {currentQuestion.type === 'jp-vi' ? 'Hãy dịch từ này sang tiếng Việt' : 'Từ tiếng Nhật tương ứng là gì?'}
              </span>
              <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white pt-4 select-all leading-snug break-all max-w-full px-2">
                {currentQuestion.prompt}
              </h2>
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 gap-4 w-full pt-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrectOption = option === currentQuestion.correctAnswer;
                
                let optionStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750';
                let iconToShow = null;

                if (isAnswered) {
                  if (isCorrectOption) {
                    optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold';
                    iconToShow = <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />;
                  } else if (isSelected) {
                    optionStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-400 font-bold';
                    iconToShow = <X className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />;
                  } else {
                    optionStyle = 'opacity-40 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 pointer-events-none';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option)}
                    disabled={isAnswered}
                    className={`w-full flex items-center justify-between text-left p-5 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.01] active:scale-95 text-base font-semibold ${optionStyle} ${!isAnswered && 'cursor-pointer'}`}
                  >
                    <span className="break-all pr-4">{option}</span>
                    {iconToShow}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold py-4 rounded-2xl active:scale-95 transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer text-base shadow-md"
              >
                {currentIdx < questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành và xem kết quả'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render State: Summary
  if (gameState === 'summary') {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const passed = accuracy >= 80;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 flex flex-col items-center transition-colors duration-300">
            
            {/* Trophy Icon */}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${passed ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
              <Trophy className="w-12 h-12" />
            </div>

            {/* Score Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                Hoàn thành bài kiểm tra!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Bộ thẻ: {deck.name}
              </p>
              {isSavedScore && (
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/30">
                    <CheckCircle2 className="w-4 h-4" /> Đã lưu kết quả vào lịch sử tài khoản
                  </span>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-md pt-4">
              <StatItem title="Số câu đúng" value={`${correctCount} / ${questions.length}`} color="text-emerald-600 dark:text-emerald-400" />
              <StatItem title="Tỉ lệ đúng" value={`${accuracy}%`} color={passed ? 'text-amber-500' : 'text-indigo-600 dark:text-indigo-400'} />
              <StatItem title="Số câu sai" value={`${wrongCount}`} color="text-rose-500 dark:text-rose-400" />
            </div>

            {/* Wrong Answers List */}
            {wrongAnswers.length > 0 && (
              <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-rose-500" />
                  Các từ cần lưu ý ({wrongAnswers.length}):
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {wrongAnswers.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                      <div className="space-y-1">
                        <p className="font-bold text-indigo-600 dark:text-indigo-400 text-base">{item.question.originalCard.word}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Nghĩa đúng: {item.question.correctAnswer}</p>
                      </div>
                      <div className="text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/20 px-3 py-1.5 rounded-lg border border-rose-100/50 dark:border-rose-900/20 text-xs sm:self-center self-start">
                        Bạn đã chọn: {item.chosenAnswer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
              <button
                onClick={() => generateQuiz(quizType)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
              >
                <RotateCcw className="w-5 h-5" />
                Làm lại
              </button>
              <Link
                to={`/decks/${id}`}
                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-4 rounded-2xl active:scale-95 transition-all text-center flex items-center justify-center gap-2 border border-slate-200/50 dark:border-slate-700/50 text-base"
              >
                <ArrowLeft className="w-5 h-5" />
                Quay lại bộ thẻ
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Sub-components
interface ConfigOptionProps {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}

const ConfigOption: React.FC<ConfigOptionProps> = ({ active, onClick, title, desc }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-5 rounded-2xl border-2 text-left flex flex-col gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-95 cursor-pointer ${
      active
        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold shadow-sm'
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
    }`}
  >
    <span className="font-extrabold text-slate-800 dark:text-white text-base">{title}</span>
    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</span>
  </button>
);

const StatItem = ({ title, value, color }: { title: string; value: string; color: string }) => (
  <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-1.5 text-center">
    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{title}</span>
    <span className={`text-xl font-black ${color}`}>{value}</span>
  </div>
);

export default DeckQuizPage;
