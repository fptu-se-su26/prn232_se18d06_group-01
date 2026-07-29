export const speakJapanese = (text: string, e?: React.MouseEvent) => {
  if (e) {
    e.stopPropagation();
  }
  if (!('speechSynthesis' in window)) {
    alert('Trình duyệt của bạn không hỗ trợ phát âm âm thanh.');
    return;
  }

  // Hủy âm thanh đang phát (nếu có)
  window.speechSynthesis.cancel();

  // Làm sạch văn bản: Loại bỏ phần giải thích trong ngoặc đơn nếu có (vd: こんにちは (Konnichiwa) -> こんにちは)
  const cleanText = text.split('(')[0].trim() || text;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.85; // Tốc độ đọc vừa phải chuẩn ngữ điệu Nhật

  const voices = window.speechSynthesis.getVoices();
  const jpVoice = voices.find(v => v.lang.includes('ja') || v.lang.includes('JP'));
  if (jpVoice) {
    utterance.voice = jpVoice;
  }

  window.speechSynthesis.speak(utterance);
};
