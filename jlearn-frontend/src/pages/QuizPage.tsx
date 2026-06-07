import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface QuizQuestion {
  questionId: number;
  content: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}



interface QuizResultDetail {
  questionId: number;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  details: QuizResultDetail[];
}

export const QuizPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Maps questionId to selected option ('A', 'B', 'C', 'D')
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/quizzes/lesson/${lessonId}`);
        setQuestions(res.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load quiz. Make sure the lesson has a quiz.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [lessonId]);

  const handleSelectOption = (questionId: number, option: string) => {
    if (result) return; // Prevent changing answer after submit
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (!lessonId) return;
    
    const formattedAnswers = questions.map(q => ({
      questionId: q.questionId,
      userAnswer: answers[q.questionId] || ''
    }));

    try {
      setSubmitting(true);
      const res = await api.post(`/quizzes/submit`, {
        lessonId: parseInt(lessonId, 10),
        answer: formattedAnswers
      });
      setResult(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="mt-4 text-indigo-600 font-semibold animate-pulse">Loading Quiz...</div>
        </div>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <div className="bg-white/60 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/50 text-center max-w-md w-full transform transition-all hover:scale-105 duration-300">
          <div className="text-red-400 text-6xl mb-6">Oops!</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Something went wrong</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <div className="bg-white/60 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/50 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Quiz Available</h2>
          <p className="text-gray-600 mb-8">There are no questions for this lesson yet.</p>
          <button 
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/50 p-6 sm:p-12 transition-all duration-500">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-6 border-b border-indigo-200/50 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight">
                {result ? 'Quiz Results' : 'Knowledge Check'}
              </h1>
              <p className="text-indigo-600/80 mt-2 font-medium">
                {result ? 'Review your performance below' : 'Test what you have learned in this lesson'}
              </p>
            </div>
            {!result && (
              <div className="px-5 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm text-indigo-800 font-bold text-sm border border-white/80">
                {Object.keys(answers).length} / {questions.length} Answered
              </div>
            )}
          </div>

          {result && (
            <div className="mb-12 p-8 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-3xl border border-emerald-400/30 text-center shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4 shadow-sm border-4 border-white">
                  <span className="text-4xl">🏆</span>
                </div>
                <h2 className="text-4xl font-black text-emerald-800 mb-3 drop-shadow-sm">
                  Score: {result.score.toFixed(1)} <span className="text-2xl text-emerald-600/80">/ 10</span>
                </h2>
                <p className="text-emerald-700 text-lg font-medium">
                  You answered <span className="font-bold">{result.correctAnswers}</span> out of <span className="font-bold">{result.totalQuestions}</span> questions correctly.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-10">
            {questions.map((q, idx) => {
              const detail = result?.details?.find(d => d.questionId === q.questionId);
              
              return (
                <div key={q.questionId} className="bg-white/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-white/60 hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-8 leading-relaxed flex items-start">
                    <span className="inline-flex items-center justify-center min-w-[2.5rem] h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg shadow-md mr-4 mt-0.5">
                      {idx + 1}
                    </span>
                    {q.content}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {[
                      { key: 'A', value: q.optionA },
                      { key: 'B', value: q.optionB },
                      { key: 'C', value: q.optionC },
                      { key: 'D', value: q.optionD },
                    ].map(opt => {
                      const isSelected = answers[q.questionId] === opt.key;
                      
                      let optionClasses = `relative overflow-hidden group flex items-center p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer focus:outline-none ${
                        isSelected 
                          ? 'bg-indigo-50/80 border-indigo-500 shadow-md transform scale-[1.02]' 
                          : 'bg-white/80 border-transparent hover:bg-white hover:border-indigo-300 hover:shadow-md'
                      }`;

                      let iconOrIndicator = (
                        <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mr-4 transition-colors duration-300 flex items-center justify-center ${
                          isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                        </div>
                      );

                      if (result && detail) {
                        const isCorrectAnswer = detail.correctAnswer === opt.key;
                        
                        if (isCorrectAnswer) {
                          optionClasses = `relative flex items-center p-5 rounded-2xl border-2 bg-emerald-50 border-emerald-500 shadow-md scale-[1.02] z-10`;
                          iconOrIndicator = (
                            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center mr-4 flex-shrink-0 shadow-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                          );
                          optionClasses = `relative flex items-center p-5 rounded-2xl border-2 bg-red-50 border-red-400 opacity-90`;
                          iconOrIndicator = (
                            <div className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center mr-4 flex-shrink-0 shadow-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </div>
                          );
                        } else {
                          optionClasses = `relative flex items-center p-5 rounded-2xl border-2 bg-white/40 border-transparent opacity-60 cursor-not-allowed`;
                          iconOrIndicator = <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-4 flex-shrink-0 bg-white/50"></div>;
                        }
                      }

                      return (
                        <button
                          key={opt.key}
                          type="button"
                          disabled={!!result}
                          onClick={() => handleSelectOption(q.questionId, opt.key)}
                          className={optionClasses}
                        >
                          {iconOrIndicator}
                          <span className={`text-left flex-1 break-words ${isSelected || (result && detail?.correctAnswer === opt.key) ? 'font-semibold text-indigo-900' : 'font-medium text-gray-700'}`}>
                            <span className="font-bold text-indigo-400/70 mr-2">{opt.key}.</span> 
                            {opt.value}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Feedback message for this specific question */}
                  {result && detail && (
                    <div className={`mt-6 p-4 rounded-xl text-sm font-medium border ${
                      detail.isCorrect 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}>
                      {detail.isCorrect 
                        ? '✨ Excellent! That is the correct answer.' 
                        : `The correct answer is ${detail.correctAnswer}.`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex justify-end pt-8 border-t border-indigo-200/50">
            {result ? (
              <button 
                onClick={() => navigate(-1)}
                className="px-8 py-4 bg-white hover:bg-indigo-50 text-indigo-700 font-bold rounded-2xl shadow-md border border-indigo-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Return to Lesson
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length < questions.length}
                className={`px-10 py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 flex items-center justify-center min-w-[200px] ${
                  submitting || Object.keys(answers).length < questions.length
                    ? 'bg-indigo-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.4)]'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Quiz
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
