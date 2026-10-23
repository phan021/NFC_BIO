import React from 'react';
import { CheckCircle2, Edit3, Sparkles, UserPlus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

/**
 * HeaderProfile Component
 * - Thanh trên cùng chỉ có "NFC Bio" bên trái và nút chuyển giao diện Sáng/Tối (chỉ icon) bên phải, thẳng hàng và cùng kích thước.
 * - Đã xóa hoàn toàn nút "Sửa Bio" ở góc trên, xóa nút "Đổi ảnh bìa" trên ảnh bìa và xóa nút máy ảnh trên ảnh đại diện.
 * - Bên dưới tên cá nhân là nút "Thêm vào danh bạ" và nút "Chỉnh sửa".
 */
const HeaderProfile = ({
  profile,
  isDark,
  onToggleTheme,
  onOpenEditModal,
  onSaveVCard,
}) => {
  return (
    <header className="relative w-full select-none">
      {/* Khu vực Ảnh Bìa (không có nút Đổi ảnh bìa ngoài màn hình chính) */}
      <div className="relative w-full h-[28vh] min-h-[195px] max-h-[250px] overflow-hidden bg-gradient-to-br from-sky-300 via-sky-200 to-blue-300 dark:from-slate-800 dark:via-slate-700 dark:to-sky-900">
        <img
          src={profile.coverUrl || './cover.jpg'}
          alt="Ảnh bìa cá nhân"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80';
          }}
          className="w-full h-full object-cover object-center transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/25 via-transparent to-slate-900/30 pointer-events-none" />

        {/* Thanh trên cùng: Chỉ có NFC Bio bên trái và nút icon Sáng/Tối bên phải */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <div
            className={`h-8 px-3 rounded-full inline-flex items-center gap-1.5 text-xs font-semibold backdrop-blur-md shadow-sm ${
              isDark
                ? 'bg-slate-800/85 text-sky-300 border border-slate-600/70'
                : 'bg-white/90 text-sky-700 border border-sky-200/90'
            }`}
          >
            <Sparkles size={13} className="text-sky-500 animate-pulse" />
            <span>NFC Bio</span>
          </div>

          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        </div>
      </div>

      {/* Khu vực Ảnh Đại Diện (không có nút camera ngoài màn hình chính) & Tên Cá Nhân */}
      <div className="relative px-5 pb-3 flex flex-col items-center text-center">
        <div className="relative -mt-16 mb-3">
          <div
            className={`w-32 h-32 rounded-full p-1 transition-all duration-300 shadow-lg ${
              isDark
                ? 'bg-gradient-to-tr from-slate-700 via-sky-500/50 to-slate-600 shadow-slate-950/60'
                : 'bg-gradient-to-tr from-white via-sky-200 to-white shadow-sky-900/15'
            }`}
          >
            <img
              src={profile.avatarUrl || './avatar.jpg'}
              alt={profile.name || 'Ảnh đại diện'}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80';
              }}
              className={`w-full h-full rounded-full object-cover border-4 ${
                isDark ? 'border-bio-darkSurface' : 'border-white'
              }`}
            />
          </div>
        </div>

        {/* Tên cá nhân */}
        <div className="flex items-center justify-center gap-1.5 mt-0.5">
          <h1
            className={`text-2xl font-extrabold tracking-tight ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}
          >
            {profile.name}
          </h1>
          <CheckCircle2
            size={20}
            className="text-sky-500 fill-sky-500/15 shrink-0"
            title="Chủ sở hữu thẻ NFC đã xác thực"
          />
        </div>

        {/* Tiểu sử (Bio) */}
        {profile.bio && (
          <p
            className={`mt-1 text-sm font-medium max-w-xs leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {profile.bio}
          </p>
        )}

        {/* Nút "Thêm vào danh bạ" & nút "Chỉnh sửa" */}
        <div className="mt-3.5 flex items-center justify-center gap-2.5 w-full max-w-xs">
          <button
            type="button"
            onClick={onSaveVCard}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-98 ${
              isDark
                ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20'
                : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25'
            }`}
          >
            <UserPlus size={15} strokeWidth={2.3} />
            <span>Thêm vào danh bạ</span>
          </button>

          <button
            type="button"
            onClick={onOpenEditModal}
            className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-semibold transition-all border active:scale-98 ${
              isDark
                ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-600/80'
                : 'bg-white/90 hover:bg-white text-sky-800 border-sky-200/90 shadow-sm'
            }`}
          >
            <Edit3 size={14} />
            <span>Chỉnh sửa</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderProfile;
