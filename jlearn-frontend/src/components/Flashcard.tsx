import React from 'react';

export interface Vocabulary {
  vocabId: number;
  kanji?: string;
  hira?: string;
  kana?: string;
  romaji?: string;
  meaning: string;
  audioUrl?: string;
}

interface FlashcardProps {
  vocabulary: Vocabulary;
  isFlipped: boolean;
  onFlip: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ vocabulary, isFlipped, onFlip }) => {
  return (
    <div 
      className="w-full max-w-md h-96 cursor-pointer mx-auto group perspective"
      style={{ perspective: '1000px' }}
      onClick={onFlip}
    >
      <div 
        className="relative w-full h-full transition-transform duration-700"
        style={{ 
          transformStyle: 'preserve-3d', 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
        }}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 w-full h-full bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col items-center justify-center p-8 border border-slate-100 dark:border-slate-700"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <h2 className="text-6xl font-extrabold text-slate-800 dark:text-slate-100 mb-6 tracking-tight">
            {vocabulary.kanji || vocabulary.kana}
          </h2>
          <p className="text-slate-400 dark:text-slate-500 font-medium animate-pulse">
            Tap to reveal meaning
          </p>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col items-center justify-center p-8 border border-indigo-100 dark:border-slate-700"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex flex-col items-center justify-center h-full w-full space-y-6">
            <div className="text-center">
              <span className="px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-bold uppercase tracking-wider mb-4 inline-block">
                Reading
              </span>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                {vocabulary.kana || vocabulary.hira || vocabulary.romaji}
              </p>
            </div>
            
            <div className="w-16 h-1 bg-indigo-200 dark:bg-slate-700 rounded-full" />
            
            <div className="text-center">
              <span className="px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-bold uppercase tracking-wider mb-4 inline-block">
                Meaning
              </span>
              <p className="text-2xl font-semibold text-slate-700 dark:text-slate-200">
                {vocabulary.meaning}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
