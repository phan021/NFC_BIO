import React from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle Component
 * Nút chuyển đổi chế độ Sáng / Tối chỉ hiển thị khung trắng (hoặc tối) và icon,
 * có chiều cao bằng đúng nhãn NFC Bio và thẳng hàng ngang.
 */
const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
      title={isDark ? 'Chế độ sáng' : 'Chế độ tối'}
      className={`h-8 px-3 rounded-full inline-flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-sm active:scale-95 ${
        isDark
          ? 'bg-slate-800/85 text-amber-300 border border-slate-600/70 hover:bg-slate-700/90'
          : 'bg-white/90 text-sky-600 border border-sky-200/90 hover:bg-white'
      }`}
    >
      {isDark ? <Moon size={15} strokeWidth={2.4} /> : <Sun size={15} strokeWidth={2.4} />}
    </button>
  );
};

export default ThemeToggle;
