import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mail, ExternalLink, Copy, Check, PhoneCall, QrCode, Landmark } from 'lucide-react';

/**
 * Bộ biểu tượng App Icon giữ nguyên thiết kế iOS Tinted Dark/Glass như ảnh mẫu.
 */
const PlatformLogo = ({ type, active }) => {
  const baseBoxClass = `relative w-11 h-11 rounded-[13px] bg-gradient-to-b from-[#545868] to-[#3f4352] border border-white/20 flex items-center justify-center text-white shadow-md shrink-0 overflow-hidden transition-all duration-300 ${
    active ? 'scale-110 -rotate-3 shadow-lg border-white/40' : ''
  }`;

  switch (type) {
    case 'phone':
      return (
        <div className={baseBoxClass}>
          <Phone size={21} strokeWidth={2.2} className="text-white drop-shadow-sm" />
        </div>
      );

    case 'email':
      return (
        <div className={baseBoxClass}>
          <Mail size={21} strokeWidth={2.2} className="text-white drop-shadow-sm" />
        </div>
      );

    case 'zalo':
      return (
        <div className={baseBoxClass}>
          <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none">
            <path
              d="M20 5C11.163 5 4 11.268 4 19c0 3.63 1.584 6.938 4.185 9.424-.29 1.88-1.15 3.84-2.185 4.976 2.25-.12 4.69-.92 6.32-1.87C14.66 32.47 17.26 33 20 33c8.837 0 16-6.268 16-14S28.837 5 20 5z"
              fill="#F3F4F6"
            />
            <text
              x="20"
              y="22.5"
              textAnchor="middle"
              fill="#3f4352"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="800"
              fontSize="10.5"
              letterSpacing="-0.3"
            >
              Zalo
            </text>
          </svg>
        </div>
      );

    case 'facebook':
      return (
        <div className={baseBoxClass}>
          <svg className="w-7 h-7 fill-white drop-shadow-sm translate-y-0.5" viewBox="0 0 24 24">
            <path d="M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.62H6.61v3.56h3.07V22h3.68v-9.12h3.06l.46-3.56h-3.52V6.65c0-1.05.29-1.73 1.76-1.73Z" />
          </svg>
        </div>
      );

    case 'instagram':
      return (
        <div className={baseBoxClass}>
          <svg className="w-6 h-6 fill-white drop-shadow-sm" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
      );

    case 'tiktok':
      return (
        <div className={baseBoxClass}>
          <svg className="w-6 h-6 fill-white drop-shadow-sm" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        </div>
      );

    case 'threads':
      return (
        <div className={baseBoxClass}>
          <svg className="w-6 h-6 fill-white drop-shadow-sm" viewBox="0 0 192 192">
            <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.13 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.113C68.882.195 47.292 9.643 32.788 28.08 19.882 44.485 13.224 67.315 13.001 95.932L13 96v.067c.224 28.617 6.882 51.447 19.788 67.854C47.292 182.358 68.882 191.806 96.957 192h.113c24.96-.173 42.554-6.708 57.048-21.19 18.963-18.944 18.392-42.691 12.142-57.27-4.484-10.454-13.033-18.945-24.723-24.552zm-43.096 40.519c-10.44.588-21.286-4.098-21.82-14.135-.397-7.442 5.296-15.746 22.461-16.735 1.966-.113 3.895-.169 5.79-.169 6.235 0 12.068.606 17.37 1.765-1.978 24.762-13.58 28.713-23.801 29.274z" />
          </svg>
        </div>
      );

    case 'locket':
      return (
        <div className={baseBoxClass}>
          <svg className="w-full h-full" viewBox="0 0 44 44" fill="none">
            <g stroke="rgba(255,255,255,0.16)" strokeWidth="1">
              <line x1="-4" y1="10" x2="48" y2="5" />
              <line x1="-4" y1="18" x2="48" y2="13" />
              <line x1="-4" y1="26" x2="48" y2="21" />
              <line x1="-4" y1="34" x2="48" y2="29" />
              <line x1="-4" y1="42" x2="48" y2="37" />
              <line x1="10" y1="-4" x2="5" y2="48" />
            </g>
            <path
              d="M22 32.5C22 32.5 11.5 26 11.5 17.8C11.5 14.2 14.3 11.5 17.6 11.5C19.6 11.5 21.2 12.5 22 14C22.8 12.5 24.4 11.5 26.4 11.5C29.7 11.5 32.5 14.2 32.5 17.8C32.5 26 22 32.5 22 32.5Z"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.55))' }}
            />
          </svg>
        </div>
      );

    case 'bank':
      return (
        <div className={baseBoxClass}>
          <Landmark size={21} strokeWidth={2.1} className="text-white drop-shadow-sm" />
        </div>
      );

    default:
      return null;
  }
};

/**
 * Bảng màu khung tác vụ theo màu đặc trưng nhẹ nhàng của từng ứng dụng trên điện thoại
 */
function getAppCardStyle(type, isDark, active) {
  if (isDark) {
    const darkStyles = {
      phone: {
        base: 'bg-emerald-950/45 border-emerald-700/50',
        active: 'bg-emerald-900/60 border-emerald-400/80 shadow-[0_8px_24px_-4px_rgba(16,185,129,0.3)]',
        title: 'text-emerald-300',
        badge: 'bg-emerald-500/20 text-emerald-300',
        badgeActive: 'bg-emerald-500 text-slate-950',
      },
      email: {
        base: 'bg-sky-950/45 border-sky-700/50',
        active: 'bg-sky-900/60 border-sky-400/80 shadow-[0_8px_24px_-4px_rgba(56,189,248,0.3)]',
        title: 'text-sky-300',
        badge: 'bg-sky-500/20 text-sky-300',
        badgeActive: 'bg-sky-400 text-slate-950',
      },
      zalo: {
        base: 'bg-blue-950/45 border-blue-700/50',
        active: 'bg-blue-900/60 border-blue-400/80 shadow-[0_8px_24px_-4px_rgba(59,130,246,0.3)]',
        title: 'text-blue-300',
        badge: 'bg-blue-500/20 text-blue-300',
        badgeActive: 'bg-blue-500 text-white',
      },
      facebook: {
        base: 'bg-indigo-950/45 border-indigo-700/50',
        active: 'bg-indigo-900/60 border-indigo-400/80 shadow-[0_8px_24px_-4px_rgba(99,102,241,0.3)]',
        title: 'text-indigo-300',
        badge: 'bg-indigo-500/20 text-indigo-300',
        badgeActive: 'bg-indigo-500 text-white',
      },
      instagram: {
        base: 'bg-gradient-to-r from-fuchsia-950/40 via-pink-950/40 to-amber-950/35 border-pink-700/50',
        active: 'bg-gradient-to-r from-fuchsia-900/55 via-pink-900/55 to-amber-900/50 border-pink-400/80 shadow-[0_8px_24px_-4px_rgba(236,72,153,0.3)]',
        title: 'text-pink-300',
        badge: 'bg-pink-500/20 text-pink-300',
        badgeActive: 'bg-pink-500 text-white',
      },
      tiktok: {
        base: 'bg-gradient-to-r from-cyan-950/40 via-slate-800/60 to-rose-950/40 border-cyan-700/45',
        active: 'bg-gradient-to-r from-cyan-900/55 via-slate-800/75 to-rose-900/55 border-cyan-400/75 shadow-[0_8px_24px_-4px_rgba(34,211,238,0.28)]',
        title: 'text-cyan-300',
        badge: 'bg-cyan-500/20 text-cyan-300',
        badgeActive: 'bg-cyan-400 text-slate-950',
      },
      threads: {
        base: 'bg-slate-800/65 border-slate-600/60',
        active: 'bg-slate-700/80 border-slate-400/80 shadow-[0_8px_24px_-4px_rgba(148,163,184,0.28)]',
        title: 'text-slate-300',
        badge: 'bg-slate-700 text-slate-200',
        badgeActive: 'bg-slate-200 text-slate-900',
      },
      locket: {
        base: 'bg-amber-950/40 border-amber-700/50',
        active: 'bg-amber-900/55 border-amber-400/80 shadow-[0_8px_24px_-4px_rgba(251,191,36,0.28)]',
        title: 'text-amber-300',
        badge: 'bg-amber-500/20 text-amber-300',
        badgeActive: 'bg-amber-400 text-slate-950',
      },
      bank: {
        base: 'bg-teal-950/45 border-teal-700/50',
        active: 'bg-teal-900/60 border-teal-400/80 shadow-[0_8px_24px_-4px_rgba(20,184,166,0.3)]',
        title: 'text-teal-300',
        badge: 'bg-teal-500/20 text-teal-300',
        badgeActive: 'bg-teal-400 text-slate-950',
      },
    };
    return darkStyles[type] || darkStyles.email;
  }

  // Chế độ sáng: Màu nhẹ nhàng theo màu đặc trưng của từng App trên điện thoại
  const lightStyles = {
    phone: {
      base: 'bg-emerald-100/55 border-emerald-200/90',
      active: 'bg-emerald-100/85 border-emerald-400 shadow-[0_8px_22px_-5px_rgba(16,185,129,0.25)]',
      title: 'text-emerald-700',
      badge: 'bg-white/80 text-emerald-600',
      badgeActive: 'bg-emerald-500 text-white shadow-sm',
    },
    email: {
      base: 'bg-sky-100/60 border-sky-200/90',
      active: 'bg-sky-100/90 border-sky-400 shadow-[0_8px_22px_-5px_rgba(14,165,233,0.25)]',
      title: 'text-sky-700',
      badge: 'bg-white/80 text-sky-600',
      badgeActive: 'bg-sky-500 text-white shadow-sm',
    },
    zalo: {
      base: 'bg-blue-100/55 border-blue-200/90',
      active: 'bg-blue-100/85 border-blue-400 shadow-[0_8px_22px_-5px_rgba(0,104,255,0.24)]',
      title: 'text-[#0068FF]',
      badge: 'bg-white/80 text-[#0068FF]',
      badgeActive: 'bg-[#0068FF] text-white shadow-sm',
    },
    facebook: {
      base: 'bg-indigo-100/55 border-blue-200/90',
      active: 'bg-indigo-100/85 border-[#1877F2]/70 shadow-[0_8px_22px_-5px_rgba(24,119,242,0.24)]',
      title: 'text-[#1877F2]',
      badge: 'bg-white/80 text-[#1877F2]',
      badgeActive: 'bg-[#1877F2] text-white shadow-sm',
    },
    instagram: {
      base: 'bg-gradient-to-r from-pink-100/55 via-rose-100/50 to-amber-100/55 border-pink-200/90',
      active: 'bg-gradient-to-r from-pink-100/85 via-rose-100/80 to-amber-100/85 border-pink-400 shadow-[0_8px_22px_-5px_rgba(236,72,153,0.25)]',
      title: 'text-pink-600',
      badge: 'bg-white/80 text-pink-600',
      badgeActive: 'bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shadow-sm',
    },
    tiktok: {
      base: 'bg-gradient-to-r from-cyan-100/50 via-slate-100/65 to-rose-100/50 border-cyan-200/90',
      active: 'bg-gradient-to-r from-cyan-100/80 via-slate-100/90 to-rose-100/80 border-cyan-400 shadow-[0_8px_22px_-5px_rgba(6,182,212,0.24)]',
      title: 'text-slate-700',
      badge: 'bg-white/80 text-slate-700',
      badgeActive: 'bg-slate-900 text-white shadow-sm',
    },
    threads: {
      base: 'bg-slate-200/55 border-slate-300/85',
      active: 'bg-slate-200/85 border-slate-400 shadow-[0_8px_22px_-5px_rgba(71,85,105,0.22)]',
      title: 'text-slate-700',
      badge: 'bg-white/80 text-slate-700',
      badgeActive: 'bg-slate-800 text-white shadow-sm',
    },
    locket: {
      base: 'bg-gradient-to-r from-amber-100/55 via-yellow-50/60 to-rose-100/50 border-amber-200/90',
      active: 'bg-gradient-to-r from-amber-100/85 via-yellow-100/80 to-rose-100/80 border-amber-400 shadow-[0_8px_22px_-5px_rgba(245,158,11,0.25)]',
      title: 'text-amber-700',
      badge: 'bg-white/80 text-amber-600',
      badgeActive: 'bg-amber-500 text-white shadow-sm',
    },
    bank: {
      base: 'bg-teal-100/55 border-teal-200/90',
      active: 'bg-teal-100/85 border-teal-400 shadow-[0_8px_22px_-5px_rgba(20,184,166,0.25)]',
      title: 'text-teal-700',
      badge: 'bg-white/80 text-teal-600',
      badgeActive: 'bg-teal-600 text-white shadow-sm',
    },
  };

  return lightStyles[type] || lightStyles.email;
}

/**
 * SocialItem Component
 * - Khung tác vụ mang màu nhẹ đặc trưng theo từng App trên điện thoại, Icon giữ nguyên.
 * - Khi trỏ hoặc chạm vào tác vụ, hiệu ứng chỉ hiện lên trong khoảng 1.6 giây (nằm trong tầm 1-3s) rồi tự động tắt.
 */
const SocialItem = ({
  type,
  title,
  subtitle,
  href,
  onClick,
  copyValue,
  isDark,
  actionType = 'link',
}) => {
  const [copied, setCopied] = useState(false);
  const [activeEffect, setActiveEffect] = useState(false);
  const timerRef = useRef(null);

  const triggerTemporaryEffect = () => {
    setActiveEffect(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Tự động tắt hiệu ứng nhanh gọn sau 550ms (0.55 giây) chuẩn micro-interaction trên điện thoại
    timerRef.current = setTimeout(() => {
      setActiveEffect(false);
    }, 550);
  };

  const clearEffectSoon = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setActiveEffect(false);
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!copyValue) return;
    navigator.clipboard?.writeText(copyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const isDirectAction = actionType === 'tel' || actionType === 'mailto';
  const appStyle = getAppCardStyle(type, isDark, activeEffect);

  const cardClassName = `relative overflow-hidden flex items-center justify-between w-full p-3.5 rounded-2xl border backdrop-blur-md transition-all duration-200 ease-out active:scale-[0.985] text-left cursor-pointer ${
    activeEffect
      ? `-translate-y-0.5 scale-[1.01] ${appStyle.active}`
      : `translate-y-0 scale-100 shadow-soft ${appStyle.base}`
  }`;

  const innerContent = (
    <>
      {/* Luồng sáng lướt nhanh gọn trong 0.5s khi trỏ/chạm rồi tự tắt */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-transform duration-500 ease-out bg-gradient-to-r ${
          isDark
            ? 'from-transparent via-white/10 to-transparent'
            : 'from-transparent via-white/60 to-transparent'
        } ${activeEffect ? 'translate-x-full' : '-translate-x-full'}`}
      />

      <div className="relative z-10 flex items-center gap-3.5 min-w-0 flex-1 pr-2">
        <PlatformLogo type={type} active={activeEffect} />

        <div
          className={`flex flex-col min-w-0 flex-1 text-left transition-transform duration-300 ${
            activeEffect ? 'translate-x-0.5' : ''
          }`}
        >
          <span className={`text-xs font-bold uppercase tracking-wider ${appStyle.title}`}>
            {title}
          </span>
          <span
            className={`text-[15px] font-extrabold truncate mt-0.5 ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}
          >
            {subtitle}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-1.5 shrink-0">
        {copyValue && (
          <button
            type="button"
            onClick={handleCopy}
            title="Sao chép"
            aria-label={`Sao chép ${title}`}
            className={`p-2 rounded-xl transition-all duration-200 active:scale-90 ${
              copied
                ? 'bg-emerald-500 text-white shadow-sm'
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-600/70'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/70'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={15} />}
          </button>
        )}

        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
            activeEffect
              ? `translate-x-0.5 scale-105 ${appStyle.badgeActive}`
              : appStyle.badge
          }`}
        >
          {actionType === 'tel' ? (
            <PhoneCall size={15} />
          ) : actionType === 'qr' ? (
            <QrCode size={16} />
          ) : (
            <ExternalLink size={15} />
          )}
        </div>
      </div>
    </>
  );

  const interactionProps = {
    onPointerEnter: triggerTemporaryEffect,
    onPointerLeave: clearEffectSoon,
    onTouchStart: triggerTemporaryEffect,
    onTouchEnd: clearEffectSoon,
  };

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        {...interactionProps}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className={cardClassName}
      >
        {innerContent}
      </div>
    );
  }

  return (
    <a
      href={href}
      target={isDirectAction ? '_self' : '_blank'}
      rel={isDirectAction ? undefined : 'noopener noreferrer'}
      {...interactionProps}
      className={cardClassName}
    >
      {innerContent}
    </a>
  );
};

export default SocialItem;
