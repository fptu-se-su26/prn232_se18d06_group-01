import React from 'react';
import { Volume2 } from 'lucide-react';
import { speakJapanese } from '../utils/speech';

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
  const wordText = vocabulary.kanji || vocabulary.kana || '';
  const wordLength = wordText.length;
  const meaningLength = (vocabulary.meaning || '').length;
  const hasDistinctReading = vocabulary.kanji !== vocabulary.kana && (vocabulary.kana || vocabulary.hira || vocabulary.romaji);

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
          className="absolute inset-0 w-full h-full bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col items-center justify-between p-8 border border-slate-100 dark:border-slate-700 relative"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Audio Button */}
          <button
            type="button"
            onClick={(e) => speakJapanese(wordText, e)}
            className="absolute top-5 right-5 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all duration-200 shadow-sm z-20 cursor-pointer active:scale-90"
            title="Phát âm tiếng Nhật"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <div className="flex-1 flex items-center justify-center w-full overflow-y-auto pr-1">
            <h2 className={`font-extrabold text-slate-800 dark:text-slate-100 text-center tracking-tight leading-snug whitespace-pre-wrap ${
              wordLength > 100 ? 'text-base sm:text-lg' :
              wordLength > 50 ? 'text-xl sm:text-2xl' :
              wordLength > 20 ? 'text-3xl sm:text-4xl' :
              'text-5xl sm:text-6xl'
            }`}>
              {wordText}
            </h2>
          </div>
          <p className="text-slate-400 dark:text-slate-500 font-medium animate-pulse mt-4 text-center">
            Chạm để lật xem nghĩa
          </p>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col items-center justify-center p-8 border border-indigo-100 dark:border-slate-700 relative"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Audio Button */}
          <button
            type="button"
            onClick={(e) => speakJapanese(wordText, e)}
            className="absolute top-5 right-5 p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all duration-200 shadow-sm z-20 cursor-pointer active:scale-90"
            title="Phát âm tiếng Nhật"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center justify-center h-full w-full space-y-4 overflow-y-auto pr-1">
            {hasDistinctReading && (
              <>
                <div className="text-center">
                  <span className="px-4 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                    Reading
                  </span>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
                    {vocabulary.kana || vocabulary.hira || vocabulary.romaji}
                  </p>
                </div>
                
                <div className="w-12 h-0.5 bg-indigo-200 dark:bg-slate-700 rounded-full" />
              </>
            )}
            
            <div className="text-center">
              <span className="px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                Meaning
              </span>
              <p className={`font-semibold text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap ${
                meaningLength > 100 ? 'text-sm sm:text-base' :
                meaningLength > 50 ? 'text-base sm:text-lg' :
                'text-xl sm:text-2xl'
              }`}>
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
