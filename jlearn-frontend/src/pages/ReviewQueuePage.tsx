import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Flashcard from '../components/Flashcard';
import type { Vocabulary } from '../components/Flashcard';

// Types mapping what we might get from api/tracking/reviews
interface ReviewItem extends Vocabulary {
  reviewId?: string;
  trackingId?: string;
}

const ReviewQueuePage: React.FC = () => {
  const [queue, setQueue] = useState<ReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetching due vocabularies
      const response = await api.get('/tracking/reviews');
      // Adjusting to common API response formats (response.data or response.data.data)
      const data = response.data.data || response.data;
      if (Array.isArray(data)) {
        setQueue(data);
      } else {
        // Fallback if data is wrapped differently
        setQueue(data.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch review queue', err);
      setError('Failed to load review items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const submitReview = async (quality: number) => {
    if (currentIndex >= queue.length || submitting) return;
    
    try {
      setSubmitting(true);
      const currentItem = queue[currentIndex];
      
      await api.post('/tracking/review', {
        vocabularyId: currentItem.vocabId,
        quality
      });

      // Move to next card
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setSubmitting(false);
      }, 400); // Wait for flip back animation before showing next
      
    } catch (err) {
      console.error('Failed to submit review', err);
      setError('Failed to submit review. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Error</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button 
            onClick={fetchQueue}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isComplete = currentIndex >= queue.length;
  const progress = queue.length > 0 ? (currentIndex / queue.length) * 100 : 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header & Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Review Session
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {isComplete ? 'All done!' : `${queue.length - currentIndex} cards remaining`}
              </p>
            </div>
            {!isComplete && (
              <div className="text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                {currentIndex + 1} <span className="text-slate-400 text-sm font-medium">/ {queue.length}</span>
              </div>
            )}
          </div>
          
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        {isComplete ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-12 text-center transform transition-all hover:scale-[1.02] duration-300 border border-slate-100 dark:border-slate-700">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Session Complete!</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">
              Great job! You've reviewed all your due items for now.
            </p>
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-xl text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-800/50 transition-colors shadow-sm"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-12">
            <Flashcard 
              vocabulary={queue[currentIndex]} 
              isFlipped={isFlipped} 
              onFlip={handleFlip} 
            />

            {/* Controls */}
            <div className={`w-full max-w-2xl transition-all duration-500 transform ${isFlipped ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
              <h3 className="text-center text-slate-500 dark:text-slate-400 font-medium mb-4 uppercase tracking-widest text-sm">
                How well did you know this?
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                  { q: 0, label: 'Blackout', desc: 'Forgot completely', color: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50 dark:hover:bg-red-900/40' },
                  { q: 1, label: 'Hard', desc: 'Wrong answer', color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50 dark:hover:bg-orange-900/40' },
                  { q: 2, label: 'Struggled', desc: 'Recalled with effort', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50 dark:hover:bg-amber-900/40' },
                  { q: 3, label: 'Good', desc: 'Recalled easily', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50 dark:hover:bg-blue-900/40' },
                  { q: 4, label: 'Easy', desc: 'Perfect recall', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50 dark:hover:bg-emerald-900/40' },
                  { q: 5, label: 'Perfect', desc: 'Instant recall', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/50 dark:hover:bg-indigo-900/40' },
                ].map((btn) => (
                  <button
                    key={btn.q}
                    onClick={() => submitReview(btn.q)}
                    disabled={submitting}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${btn.color} ${submitting ? 'opacity-50 cursor-not-allowed' : 'transform hover:-translate-y-1 hover:shadow-md'}`}
                  >
                    <span className="text-lg font-bold mb-1">{btn.q}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewQueuePage;
