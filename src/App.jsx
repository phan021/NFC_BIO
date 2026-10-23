import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Save,
  X,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Upload,
  QrCode,
  Copy,
  Check,
  KeyRound,
} from 'lucide-react';
import HeaderProfile from './components/HeaderProfile.jsx';
import SocialList from './components/SocialList.jsx';
import SnowEffect from './components/SnowEffect.jsx';
import {
  DEFAULT_BIO_DATA,
  DEFAULT_ADMIN_PIN,
  subscribeToBioProfile,
  updateBioProfile,
  compressImageFile,
} from './config/firebase';

const THEME_STORAGE_KEY = 'nfc_bio_theme_mode';
const AUTH_UNLOCK_TIME_KEY = 'nfc_bio_admin_unlocked_at';
// Tự động reset khóa chỉnh sửa sau 1 phút (60.000 ms)
const AUTO_LOCK_DURATION_MS = 1 * 60 * 1000;

function App() {
  // 1. Trạng thái chế độ nền: Mặc định là chế độ sáng (màu nhẹ dịu mắt)
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === 'dark';
  });

  // 2. Dữ liệu trang Bio (đồng bộ từ Firebase Firestore / LocalStorage)
  const [profile, setProfile] = useState(DEFAULT_BIO_DATA);

  // 3. Trạng thái mở khóa chỉnh sửa (tự động hết hạn sau 1 phút)
  const [unlockedAt, setUnlockedAt] = useState(() => {
    const savedTime = Number(sessionStorage.getItem(AUTH_UNLOCK_TIME_KEY) || 0);
    if (savedTime && Date.now() - savedTime < AUTO_LOCK_DURATION_MS) {
      return savedTime;
    }
    sessionStorage.removeItem(AUTH_UNLOCK_TIME_KEY);
    return 0;
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBankQrModalOpen, setIsBankQrModalOpen] = useState(false);
  const [bankCopied, setBankCopied] = useState(false);

  const [pinPrompt, setPinPrompt] = useState({
    open: false,
    pinInput: '',
    error: '',
    pendingAction: null,
  });

  // Form dữ liệu trong Modal Chỉnh sửa Bio
  const [formData, setFormData] = useState(DEFAULT_BIO_DATA);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Đồng bộ class 'dark' trên thẻ html
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [isDark]);

  // Lắng nghe dữ liệu từ Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToBioProfile((data) => {
      setProfile(data);
      setFormData(data);
    });
    return () => unsubscribe();
  }, []);

  // Đặt tiêu đề tab trình duyệt cố định là NFC Bio
  useEffect(() => {
    document.title = 'NFC Bio';
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3000);
  };

  // Bộ đếm tự động reset phần chỉnh sửa Bio sau đúng 1 phút kể từ lúc mở khóa
  useEffect(() => {
    if (!unlockedAt) return;

    const checkExpiration = () => {
      const elapsed = Date.now() - unlockedAt;
      if (elapsed >= AUTO_LOCK_DURATION_MS) {
        setUnlockedAt(0);
        sessionStorage.removeItem(AUTH_UNLOCK_TIME_KEY);
        setIsEditModalOpen(false);
      }
    };

    const remaining = Math.max(0, AUTO_LOCK_DURATION_MS - (Date.now() - unlockedAt));
    const timerId = setTimeout(checkExpiration, remaining);
    const intervalId = setInterval(checkExpiration, 5000);

    return () => {
      clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, [unlockedAt]);

  // Kiểm tra mật khẩu trước khi mở phần Chỉnh sửa Bio
  const requireAdminAuth = (actionCallback) => {
    if (unlockedAt && Date.now() - unlockedAt < AUTO_LOCK_DURATION_MS) {
      actionCallback();
    } else {
      setUnlockedAt(0);
      sessionStorage.removeItem(AUTH_UNLOCK_TIME_KEY);
      setPinPrompt({
        open: true,
        pinInput: '',
        error: '',
        pendingAction: () => actionCallback,
      });
    }
  };

  const handleVerifyPin = (e) => {
    e.preventDefault();
    const currentPassword = profile.adminPassword || DEFAULT_ADMIN_PIN;
    if (pinPrompt.pinInput.trim() === String(currentPassword).trim()) {
      const now = Date.now();
      setUnlockedAt(now);
      sessionStorage.setItem(AUTH_UNLOCK_TIME_KEY, String(now));
      const nextAction = pinPrompt.pendingAction;
      setPinPrompt({ open: false, pinInput: '', error: '', pendingAction: null });
      showToast('Đã mở khóa Chỉnh sửa Bio');
      if (nextAction) {
        const fn = nextAction();
        if (typeof fn === 'function') fn();
      }
    } else {
      setPinPrompt((prev) => ({
        ...prev,
        error: 'Mật khẩu chưa đúng, vui lòng thử lại.',
      }));
    }
  };

  // Mở hộp thoại Chỉnh sửa Bio
  const handleOpenEdit = () => {
    requireAdminAuth(() => {
      setFormData(profile);
      setIsEditModalOpen(true);
    });
  };

  // Lưu toàn bộ thông tin chỉnh sửa
  const handleSaveForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanPassword = (formData.adminPassword || '').trim() || DEFAULT_ADMIN_PIN;
      const payload = {
        ...formData,
        adminPassword: cleanPassword,
      };
      const result = await updateBioProfile(payload);
      setProfile(result.data);
      setIsEditModalOpen(false);
      showToast(
        result.savedToFirebase
          ? 'Đã lưu thông tin lên Firebase!'
          : 'Đã lưu thông tin thành công!'
      );
    } catch (err) {
      showToast('Không thể lưu dữ liệu: ' + (err.message || 'Lỗi kết nối'), 'error');
    } finally {
      setSaving(false);
    }
  };

  // Cập nhật từng trường mạng xã hội trong form
  const handleSocialChange = (platform, field, value) => {
    setFormData((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [platform]: {
          ...prev.socials?.[platform],
          [field]: value,
        },
      },
    }));
  };

  // Cập nhật thông tin Ngân hàng trong form
  const handleBankChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      bank: {
        ...prev.bank,
        [field]: value,
      },
    }));
  };

  // Tạo và tải file danh bạ vCard (.vcf)
  const handleSaveVCard = () => {
    const cleanPhone = (profile.phone || '').replace(/\s+/g, '');
    const vcardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profile.name || ''}`,
      `TEL;TYPE=CELL:${cleanPhone}`,
      `EMAIL:${profile.email || ''}`,
      `NOTE:${profile.bio || ''}`,
      `URL:${window.location.href}`,
      'END:VCARD',
    ];
    const blob = new Blob([vcardLines.join('\r\n')], {
      type: 'text/vcard;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${(profile.name || 'contact').replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Đang mở tệp Thêm vào danh bạ...');
  };

  const handleCopyBankStk = () => {
    const stk = profile.bank?.accountNumber || '';
    if (!stk) return;
    navigator.clipboard?.writeText(stk);
    setBankCopied(true);
    setTimeout(() => setBankCopied(false), 1800);
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 flex flex-col items-center justify-start sm:py-6 sm:px-4 ${
        isDark
          ? 'bg-bio-darkBg text-slate-100'
          : 'bg-[#f4f9ff] text-slate-800'
      }`}
    >
      {/* Hiệu ứng tuyết rơi hạt tròn nhẹ bé tí & cánh tuyết ❄️ đi theo con trỏ */}
      <SnowEffect isDark={isDark} />

      {/* Thông báo nhanh (Toast) */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm pointer-events-none">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-xs font-semibold backdrop-blur-md border transition-all ${
              toast.type === 'error'
                ? 'bg-rose-500/95 text-white border-rose-400'
                : isDark
                ? 'bg-slate-800/95 text-sky-300 border-sky-500/40'
                : 'bg-sky-600/95 text-white border-sky-400'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={16} className="shrink-0" />
            ) : (
              <CheckCircle size={16} className="shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Khung hiển thị chính: Giao diện sáng màu nhẹ hơn, thanh thoát */}
      <main
        className={`relative w-full max-w-[440px] min-h-screen sm:min-h-[820px] sm:rounded-[36px] overflow-hidden transition-colors duration-300 flex flex-col ${
          isDark
            ? 'bg-bio-darkSurface sm:border sm:border-slate-700/80 sm:shadow-2xl'
            : 'bg-gradient-to-b from-[#f8fbff] via-[#f1f8ff] to-[#eaf4fe] sm:border sm:border-sky-100 sm:shadow-xl'
        }`}
      >
        <HeaderProfile
          profile={profile}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          onOpenEditModal={handleOpenEdit}
          onSaveVCard={handleSaveVCard}
        />

        <SocialList
          profile={profile}
          isDark={isDark}
          onOpenBankQr={() => setIsBankQrModalOpen(true)}
        />
      </main>

      {/* Hộp thoại hiển thị Mã QR Ngân hàng khi nhấn vào mục Ngân hàng */}
      {isBankQrModalOpen && (
        <div
          className="fixed inset-0 h-[100dvh] z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm"
          onClick={() => setIsBankQrModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-xs rounded-3xl p-5 shadow-2xl border text-center transition-all ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-100'
                : 'bg-white border-sky-100 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center">
                  <QrCode size={17} />
                </div>
                <div className="text-left">
                  <h2 className="text-sm font-bold leading-tight">
                    {profile.bank?.bankName || 'Ngân hàng'}
                  </h2>
                  <p className="text-xs opacity-75">
                    STK : {profile.bank?.accountNumber || 'Chưa cập nhật'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBankQrModalOpen(false)}
                className="p-1.5 rounded-xl opacity-70 hover:opacity-100"
              >
                <X size={18} />
              </button>
            </div>

            <div
              className={`w-full aspect-square rounded-2xl overflow-hidden border flex items-center justify-center p-3 mb-3.5 ${
                isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-sky-50/60 border-sky-100'
              }`}
            >
              {profile.bank?.qrUrl ? (
                <img
                  src={profile.bank.qrUrl}
                  alt="Mã QR Ngân hàng"
                  className="w-full h-full object-contain rounded-xl bg-white p-1"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 px-4 text-center opacity-70">
                  <QrCode size={42} className="text-sky-500 opacity-75" />
                  <p className="text-xs font-medium">
                    Chưa có ảnh QR ngân hàng. Hãy vào mục <b>Chỉnh sửa</b> để tải ảnh QR lên.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyBankStk}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  bankCopied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sm'
                }`}
              >
                {bankCopied ? <Check size={14} /> : <Copy size={14} />}
                <span>{bankCopied ? 'Đã sao chép STK' : 'Sao chép STK'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBankQrModalOpen(false)}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold border ${
                  isDark
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hộp thoại nhập Mật khẩu Chỉnh sửa Bio */}
      {pinPrompt.open && (
        <div className="fixed inset-0 h-[100dvh] z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div
            className={`w-full max-w-xs rounded-3xl p-5 shadow-2xl border ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-100'
                : 'bg-white border-sky-100 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center">
                  <Lock size={16} />
                </div>
                <h2 className="text-sm font-bold">Mật khẩu Chỉnh sửa Bio</h2>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPinPrompt({ open: false, pinInput: '', error: '', pendingAction: null })
                }
                className="p-1 rounded-lg opacity-70 hover:opacity-100"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs opacity-80 mb-3 leading-relaxed">
              Nhập mật khẩu của bạn để mở phần Chỉnh sửa Bio.
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-3">
              <input
                type="password"
                autoFocus
                placeholder="Nhập mật khẩu..."
                value={pinPrompt.pinInput}
                onChange={(e) =>
                  setPinPrompt((prev) => ({ ...prev, pinInput: e.target.value, error: '' }))
                }
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold border outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 focus:border-sky-400 text-white'
                    : 'bg-sky-50/70 border-sky-200 focus:border-sky-500 text-slate-900'
                }`}
              />

              {pinPrompt.error && (
                <p className="text-xs text-rose-500 font-medium">{pinPrompt.error}</p>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setPinPrompt({ open: false, pinInput: '', error: '', pendingAction: null })
                  }
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border ${
                    isDark
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
                >
                  Mở khóa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hộp thoại Chỉnh sửa Bio */}
      {isEditModalOpen && (
        <div className="fixed inset-0 h-[100dvh] z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/60 backdrop-blur-sm">
          <div
            className={`w-full max-w-[440px] max-h-[90dvh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl border overflow-hidden ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-100'
                : 'bg-white border-sky-100 text-slate-800'
            }`}
          >
            {/* Header Modal: Chỉnh sửa Bio */}
            <div
              className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
                isDark ? 'border-slate-700 bg-slate-800' : 'border-sky-100 bg-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Unlock size={16} className="text-sky-500" />
                <h2 className="text-base font-bold">Chỉnh sửa Bio</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl opacity-70 hover:opacity-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nội dung Form cuộn dọc */}
            <form
              id="edit-bio-form"
              onSubmit={handleSaveForm}
              className="p-5 overflow-y-auto space-y-4 text-left flex-1"
            >
              {/* Đổi ảnh đại diện và ảnh bìa trong phần chỉnh sửa */}
              <div
                className={`p-3.5 rounded-2xl border space-y-2.5 ${
                  isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-sky-50/70 border-sky-100'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-sky-500">
                  Ảnh đại diện & Ảnh bìa
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <label
                    className={`cursor-pointer flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-600 hover:bg-slate-700'
                        : 'bg-white border-sky-200 hover:bg-sky-50'
                    }`}
                  >
                    <Upload size={14} className="text-sky-500" />
                    <span>Tải Ảnh đại diện</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const dataUrl = await compressImageFile(file, {
                          maxWidth: 480,
                          maxHeight: 480,
                        });
                        setFormData((prev) => ({ ...prev, avatarUrl: dataUrl }));
                        showToast('Đã chọn ảnh đại diện mới');
                      }}
                    />
                  </label>

                  <label
                    className={`cursor-pointer flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-600 hover:bg-slate-700'
                        : 'bg-white border-sky-200 hover:bg-sky-50'
                    }`}
                  >
                    <Upload size={14} className="text-sky-500" />
                    <span>Tải Ảnh bìa</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const dataUrl = await compressImageFile(file, {
                          maxWidth: 1100,
                          maxHeight: 650,
                        });
                        setFormData((prev) => ({ ...prev, coverUrl: dataUrl }));
                        showToast('Đã chọn ảnh bìa mới');
                      }}
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      avatarUrl: './avatar.jpg',
                      coverUrl: './cover.jpg',
                    }))
                  }
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-500 hover:underline"
                >
                  <RotateCcw size={12} />
                  <span>Dùng lại ảnh public</span>
                </button>
              </div>

              {/* Thông tin cá nhân */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-500">
                  Thông tin cá nhân
                </p>

                <div>
                  <label className="block text-xs font-semibold mb-1">Tên cá nhân</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm border outline-none ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Tiểu sử (Bio)</label>
                  <input
                    type="text"
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm border outline-none ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">1. Số điện thoại</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3.5 py-2 rounded-xl text-sm border outline-none ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">2. Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-3.5 py-2 rounded-xl text-sm border outline-none ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Liên kết mạng xã hội đánh số 3 -> 8 */}
              <div className="space-y-3 pt-1">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-500">
                  Liên kết Mạng xã hội
                </p>

                {[
                  {
                    key: 'zalo',
                    title: '3. Zalo (Hiển thị tên)',
                    field: 'displayName',
                    placeholder: 'VD: Nguyễn Văn A',
                    urlPlaceholder: 'https://zalo.me/0901234567',
                  },
                  {
                    key: 'facebook',
                    title: '4. Facebook (Hiển thị tên)',
                    field: 'displayName',
                    placeholder: 'VD: Nguyễn Văn A',
                    urlPlaceholder: 'https://www.facebook.com/username',
                  },
                  {
                    key: 'instagram',
                    title: '5. Instagram (Hiển thị ID)',
                    field: 'account',
                    placeholder: 'VD: nguyenvana.ig',
                    urlPlaceholder: 'https://www.instagram.com/username',
                  },
                  {
                    key: 'tiktok',
                    title: '6. TikTok (Hiển thị ID)',
                    field: 'account',
                    placeholder: 'VD: nguyenvana.tiktok',
                    urlPlaceholder: 'https://www.tiktok.com/@username',
                  },
                  {
                    key: 'threads',
                    title: '7. Threads (Hiển thị ID)',
                    field: 'account',
                    placeholder: 'VD: nguyenvana.threads',
                    urlPlaceholder: 'https://www.threads.net/@username',
                  },
                  {
                    key: 'locket',
                    title: '8. Locket (Hiển thị ID)',
                    field: 'account',
                    placeholder: 'VD: nguyenvana.locket',
                    urlPlaceholder: 'https://locket.cam/username',
                  },
                ].map((net) => (
                  <div
                    key={net.key}
                    className={`p-3 rounded-2xl border space-y-2 ${
                      isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50/80 border-slate-200'
                    }`}
                  >
                    <label className="block text-xs font-bold">{net.title}</label>
                    <input
                      type="text"
                      placeholder={net.placeholder}
                      value={
                        formData.socials?.[net.key]?.[net.field] ||
                        formData.socials?.[net.key]?.displayName ||
                        formData.socials?.[net.key]?.account ||
                        ''
                      }
                      onChange={(e) => {
                        handleSocialChange(net.key, 'displayName', e.target.value);
                        handleSocialChange(net.key, 'account', e.target.value);
                      }}
                      className={`w-full px-3 py-1.5 rounded-xl text-xs border outline-none ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                    <input
                      type="url"
                      placeholder={net.urlPlaceholder}
                      value={formData.socials?.[net.key]?.url || ''}
                      onChange={(e) => handleSocialChange(net.key, 'url', e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-xl text-xs border outline-none ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-sky-300'
                          : 'bg-white border-slate-200 text-sky-700'
                      }`}
                    />
                  </div>
                ))}

                {/* 9. Tài khoản ngân hàng & Tải lên Mã QR */}
                <div
                  className={`p-3.5 rounded-2xl border space-y-2.5 ${
                    isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50/80 border-slate-200'
                  }`}
                >
                  <label className="block text-xs font-bold">
                    9. Tài khoản ngân hàng & Mã QR
                  </label>
                  <input
                    type="text"
                    placeholder="Tên ngân hàng (VD: Vietcombank, MB Bank...)"
                    value={formData.bank?.bankName || ''}
                    onChange={(e) => handleBankChange('bankName', e.target.value)}
                    className={`w-full px-3 py-1.5 rounded-xl text-xs border outline-none ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Số tài khoản (VD: 0901234567)"
                    value={formData.bank?.accountNumber || ''}
                    onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                    className={`w-full px-3 py-1.5 rounded-xl text-xs border outline-none ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />

                  <div className="flex items-center gap-2.5 pt-1">
                    <label
                      className={`flex-1 cursor-pointer flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        isDark
                          ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 text-sky-300'
                          : 'bg-white border-sky-200 hover:bg-sky-50 text-sky-700'
                      }`}
                    >
                      <QrCode size={14} />
                      <span>
                        {formData.bank?.qrUrl ? 'Đổi ảnh QR ngân hàng' : 'Tải ảnh QR ngân hàng'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const qrDataUrl = await compressImageFile(file, {
                            maxWidth: 750,
                            maxHeight: 750,
                            quality: 0.88,
                          });
                          handleBankChange('qrUrl', qrDataUrl);
                          showToast('Đã tải ảnh QR ngân hàng lên');
                        }}
                      />
                    </label>

                    {formData.bank?.qrUrl && (
                      <img
                        src={formData.bank.qrUrl}
                        alt="QR Preview"
                        className="w-10 h-10 rounded-lg object-cover border border-sky-300 bg-white p-0.5 shrink-0"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Chỉnh sửa mật khẩu chỉnh sửa Bio ở cuối trang chỉnh sửa */}
              <div
                className={`p-3.5 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-sky-50/70 border-sky-100'
                }`}
              >
                <div className="flex items-center gap-1.5 text-sky-500">
                  <KeyRound size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Mật khẩu chỉnh sửa Bio
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Nhập mật khẩu chỉnh sửa mới..."
                  value={formData.adminPassword || ''}
                  onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-sm font-semibold border outline-none ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-white border-sky-200 text-slate-900'
                  }`}
                />
              </div>
            </form>

            {/* Thanh nút cố định dưới đáy Modal */}
            <div
              className={`px-5 py-3.5 border-t flex items-center gap-2.5 shrink-0 ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-100'
              }`}
            >
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold border ${
                  isDark
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Đóng
              </button>
              <button
                type="submit"
                form="edit-bio-form"
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-md"
              >
                <Save size={15} />
                <span>{saving ? 'Đang lưu...' : 'Lưu thông tin Bio'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
