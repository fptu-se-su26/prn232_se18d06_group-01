import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Volume2, 
  HelpCircle, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Sun, 
  Moon, 
  LogIn, 
  UserPlus, 
  Layers, 
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [activeFlipped, setActiveFlipped] = useState(false);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* ===== Navigation Bar ===== */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-600/25">
              J
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              JLearn
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Tính năng</a>
            <a href="#demo" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Trải nghiệm</a>
            <a href="#community" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Cộng đồng</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Đổi giao diện"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
              >
                Vào ứng dụng <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="hidden sm:flex items-center gap-1.5 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" /> Đăng nhập
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Đăng ký ngay
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs sm:text-sm font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Nền tảng Học Từ vựng Tiếng Nhật Thông minh & Miễn phí</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            Ghi nhớ Từ vựng Tiếng Nhật <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
              Dễ dàng & Phản xạ Tự nhiên
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Kết hợp thẻ lật Flashcard 3D, giọng phát âm tiếng Nhật chuẩn ngữ điệu, kiểm tra trắc nghiệm đa chế độ và kho dữ liệu từ vựng từ cộng đồng.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/35 active:scale-95 transition-all cursor-pointer"
            >
              Bắt đầu học miễn phí
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-base px-7 py-4 rounded-2xl transition-all shadow-sm cursor-pointer"
            >
              Xem Demo trải nghiệm
            </a>
          </div>

          {/* Key Value Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Không cần cài đặt app
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tích hợp giọng đọc ja-JP
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Lưu tiến độ học tập 100%
            </div>
          </div>

        </div>
      </section>

      {/* ===== Demo Preview Section ===== */}
      <section id="demo" className="py-16 bg-white dark:bg-slate-900/50 border-y border-slate-200/60 dark:border-slate-800/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trải nghiệm Thẻ Lật 3D Trực quan
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base">
              Bấm vào thẻ bên dưới để thử lật xem nghĩa tiếng Việt và luyện phản xạ từ vựng ngay lập tức.
            </p>
          </div>

          {/* Interactive Card Snippet */}
          <div className="flex items-center justify-center">
            <div 
              onClick={() => setActiveFlipped(!activeFlipped)}
              className="w-full max-w-sm h-80 cursor-pointer group perspective"
              style={{ perspective: '1000px' }}
            >
              <div 
                className="relative w-full h-full transition-transform duration-700"
                style={{ 
                  transformStyle: 'preserve-3d', 
                  transform: activeFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
                }}
              >
                {/* Front */}
                <div 
                  className="absolute inset-0 w-full h-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex flex-col items-center justify-between p-8 border border-slate-200 dark:border-slate-700"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
                    Kanji / Hiragana
                  </span>
                  <div className="text-center">
                    <h3 className="text-5xl font-black text-slate-900 dark:text-white">
                      日本語
                    </h3>
                    <p className="text-slate-400 dark:text-slate-500 font-semibold mt-2 text-sm">
                      (Nihongo)
                    </p>
                  </div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold animate-pulse">
                    👉 Bấm để xem ý nghĩa
                  </p>
                </div>

                {/* Back */}
                <div 
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-3xl shadow-xl flex flex-col items-center justify-between p-8 border border-indigo-500"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                    Meaning
                  </span>
                  <div className="text-center space-y-2">
                    <h3 className="text-3xl font-extrabold">
                      Tiếng Nhật
                    </h3>
                    <p className="text-indigo-200 text-sm font-medium">
                      Ngôn ngữ được nói tại Nhật Bản
                    </p>
                  </div>
                  <p className="text-xs text-indigo-200 font-semibold">
                    ✅ Đã lật mặt sau
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===== Features Grid ===== */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Mọi Công Cụ Bạn Cần Để Làm Chủ Từ Vựng
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Hệ thống được thiết kế tối giản, tập trung tối đa vào hiệu quả ghi nhớ và trải nghiệm học tập của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <FeatureCard 
            icon={<BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
            title="Lật thẻ Flashcard 3D"
            description="Luyện phản xạ hai chiều Nhật - Việt trực quan với hiệu ứng 3D mượt mà, hỗ trợ chế độ Dark mode dịu mắt."
          />

          <FeatureCard 
            icon={<Volume2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />}
            title="Phát âm Giọng đọc Nhật 🔊"
            description="Tích hợp chuẩn Web Speech API phát âm tiếng Nhật (ja-JP) chuẩn ngữ điệu giúp luyện nghe từ vựng tức thì."
          />

          <FeatureCard 
            icon={<HelpCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
            title="Trắc nghiệm Quiz Mode"
            description="3 chế độ kiểm tra thông minh (Nhật-Việt, Việt-Nhật, Trộn) tự động chấm điểm % và lưu lịch sử bài thi."
          />

          <FeatureCard 
            icon={<Compass className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
            title="Khám phá Cộng đồng 🧭"
            description="Khám phá kho bộ thẻ công khai của người dùng khác và sao chép (Clone) toàn bộ nội dung về kho cá nhân 1-click."
          />

          <FeatureCard 
            icon={<Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400" />}
            title="Import Từ vựng Siêu tốc"
            description="Nhập hàng chục từ vựng cùng lúc từ văn bản dạng CSV / Text đơn giản chỉ trong 1 giây."
          />

          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />}
            title="Bảo mật & Giữ phiên F5 ⚡"
            description="Hệ thống JWT + Refresh Token tự động duy trì trạng thái đăng nhập an toàn, không lo bị văng khi F5."
          />

        </div>
      </section>

      {/* ===== Community Banner ===== */}
      <section id="community" className="py-20 bg-gradient-to-tr from-indigo-900 via-slate-900 to-violet-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="space-y-4 text-center lg:text-left max-w-xl">
            <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-extrabold uppercase tracking-wider">
              Bắt đầu hành trình hôm nay
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Sẵn sàng nâng cao vốn từ vựng Tiếng Nhật?
            </h2>
            <p className="text-indigo-200 text-base sm:text-lg">
              Tạo tài khoản ngay bây giờ để tự tạo bộ thẻ đầu tiên hoặc khám phá bộ thẻ N5, N4 có sẵn từ cộng đồng!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-indigo-950 hover:bg-slate-100 font-black text-base px-8 py-4 rounded-2xl shadow-2xl active:scale-95 transition-all cursor-pointer text-center"
            >
              Đăng ký tài khoản miễn phí
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-400/30 text-white font-bold text-base px-8 py-4 rounded-2xl transition-all cursor-pointer text-center"
            >
              Đăng nhập
            </button>
          </div>

        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="py-10 border-t border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              J
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">JLearn Platform</span>
          </div>
          <p>© 2026 JLearn - Group 01. Được phát triển với ASP.NET Core 8 Web API & React TypeScript.</p>
        </div>
      </footer>

    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/70 dark:border-slate-800/70 shadow-sm hover:shadow-xl hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 space-y-4">
    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 flex items-center justify-center shadow-inner">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
      {title}
    </h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
      {description}
    </p>
  </div>
);

export default LandingPage;
