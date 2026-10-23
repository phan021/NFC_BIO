import React from 'react';
import SocialItem from './SocialItem';

/**
 * SocialList Component
 * - Sắp xếp các mục thông tin cá nhân, mạng xã hội và ngân hàng theo chiều dọc:
 *   1. Số điện thoại
 *   2. Email
 *   3. Zalo (chỉ hiện tên)
 *   4. Facebook (chỉ hiện tên)
 *   5. Instagram (chỉ hiện ID)
 *   6. TikTok (chỉ hiện ID)
 *   7. Threads (chỉ hiện ID)
 *   8. Locket (chỉ hiện ID)
 *   9. Ngân hàng (hiện tên Ngân hàng, dưới là "STK : ...", nhấn vào hiện QR tải lên)
 */
const SocialList = ({ profile, isDark, onOpenBankQr }) => {
  const cleanPhone = (profile.phone || '').replace(/\s+/g, '');
  const zaloUrl =
    profile.socials?.zalo?.url ||
    `https://zalo.me/${cleanPhone.replace(/[^0-9a-zA-Z]/g, '')}`;

  // Hàm loại bỏ phần SĐT trong ngoặc nếu dữ liệu cũ còn lưu dạng "Tên (SĐT)"
  const getOnlyName = (val, fallback) => {
    const raw = val || fallback || 'Chưa cập nhật';
    return raw.replace(/\s*\([0-9+\s.]+\)\s*$/, '').trim();
  };

  const bankName = profile.bank?.bankName || 'Ngân hàng';
  const accountNumber = profile.bank?.accountNumber || 'Chưa cập nhật';

  const items = [
    {
      id: 'phone',
      type: 'phone',
      title: 'Số điện thoại',
      subtitle: profile.phone || 'Chưa cập nhật',
      href: `tel:${cleanPhone}`,
      copyValue: profile.phone,
      actionType: 'tel',
    },
    {
      id: 'email',
      type: 'email',
      title: 'Email',
      subtitle: profile.email || 'Chưa cập nhật',
      href: `mailto:${profile.email || ''}`,
      copyValue: profile.email,
      actionType: 'mailto',
    },
    {
      id: 'zalo',
      type: 'zalo',
      title: 'Zalo',
      subtitle: getOnlyName(profile.socials?.zalo?.displayName, profile.name),
      href: zaloUrl,
      copyValue: cleanPhone,
      actionType: 'link',
    },
    {
      id: 'facebook',
      type: 'facebook',
      title: 'Facebook',
      subtitle: getOnlyName(profile.socials?.facebook?.displayName, profile.name),
      href: profile.socials?.facebook?.url || 'https://facebook.com',
      copyValue: profile.socials?.facebook?.url,
      actionType: 'link',
    },
    {
      id: 'instagram',
      type: 'instagram',
      title: 'Instagram',
      subtitle:
        profile.socials?.instagram?.account ||
        profile.socials?.instagram?.displayName ||
        'Chưa cập nhật',
      href: profile.socials?.instagram?.url || 'https://instagram.com',
      copyValue:
        profile.socials?.instagram?.account ||
        profile.socials?.instagram?.displayName,
      actionType: 'link',
    },
    {
      id: 'tiktok',
      type: 'tiktok',
      title: 'TikTok',
      subtitle:
        profile.socials?.tiktok?.account ||
        profile.socials?.tiktok?.displayName ||
        'Chưa cập nhật',
      href: profile.socials?.tiktok?.url || 'https://tiktok.com',
      copyValue:
        profile.socials?.tiktok?.account ||
        profile.socials?.tiktok?.displayName,
      actionType: 'link',
    },
    {
      id: 'threads',
      type: 'threads',
      title: 'Threads',
      subtitle:
        profile.socials?.threads?.account ||
        profile.socials?.threads?.displayName ||
        'Chưa cập nhật',
      href: profile.socials?.threads?.url || 'https://threads.net',
      copyValue:
        profile.socials?.threads?.account ||
        profile.socials?.threads?.displayName,
      actionType: 'link',
    },
    {
      id: 'locket',
      type: 'locket',
      title: 'Locket',
      subtitle:
        profile.socials?.locket?.account ||
        profile.socials?.locket?.displayName ||
        'Chưa cập nhật',
      href: profile.socials?.locket?.url || 'https://locket.cam',
      copyValue:
        profile.socials?.locket?.account ||
        profile.socials?.locket?.displayName,
      actionType: 'link',
    },
    {
      id: 'bank',
      type: 'bank',
      title: bankName,
      subtitle: `STK : ${accountNumber}`,
      onClick: onOpenBankQr,
      copyValue: accountNumber,
      actionType: 'qr',
    },
  ];

  return (
    <section
      aria-label="Danh sách liên hệ, mạng xã hội và ngân hàng"
      className="w-full px-4 pt-2 pb-7 flex flex-col gap-3"
    >
      {items.map((item) => (
        <SocialItem
          key={item.id}
          type={item.type}
          title={item.title}
          subtitle={item.subtitle}
          href={item.href}
          onClick={item.onClick}
          copyValue={item.copyValue}
          actionType={item.actionType}
          isDark={isDark}
        />
      ))}
    </section>
  );
};

export default SocialList;
