import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';

// Cấu hình Firebase - Đọc từ biến môi trường (.env) hoặc điền trực tiếp tại đây
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.includes('YOUR_')
);

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.warn('Không thể khởi tạo Firebase, chuyển sang chế độ lưu trữ cục bộ:', error);
  }
}

export { db };

export const BIO_COLLECTION = 'bio_profiles';
export const BIO_DOCUMENT_ID = 'main_profile';
const LOCAL_STORAGE_KEY = 'nfc_bio_profile_data_v2';

// Mật khẩu mặc định ban đầu để mở khóa chỉnh sửa
export const DEFAULT_ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '1234';

// Dữ liệu mặc định ban đầu
export const DEFAULT_BIO_DATA = {
  name: 'Nguyễn Văn A',
  bio: 'Digital Creator • Tech Enthusiast ✨',
  avatarUrl: './avatar.jpg',
  coverUrl: './cover.jpg',
  phone: '0901234567',
  email: 'lienhe@nguyenvana.vn',
  adminPassword: DEFAULT_ADMIN_PIN,
  socials: {
    zalo: {
      label: 'Zalo',
      displayName: 'Nguyễn Văn A',
      url: 'https://zalo.me/0901234567',
    },
    facebook: {
      label: 'Facebook',
      displayName: 'Nguyễn Văn A',
      url: 'https://www.facebook.com/nguyenvana.official',
    },
    instagram: {
      label: 'Instagram',
      account: 'nguyenvana.ig',
      url: 'https://www.instagram.com/nguyenvana.ig',
    },
    tiktok: {
      label: 'TikTok',
      account: 'nguyenvana.tiktok',
      url: 'https://www.tiktok.com/@nguyenvana.tiktok',
    },
    threads: {
      label: 'Threads',
      account: 'nguyenvana.threads',
      url: 'https://www.threads.net/@nguyenvana.threads',
    },
    locket: {
      label: 'Locket',
      account: 'nguyenvana.locket',
      url: 'https://locket.cam/nguyenvana',
    },
  },
  bank: {
    bankName: 'MB Bank',
    accountNumber: '0901234567',
    qrUrl: '',
  },
  updatedAt: new Date().toISOString(),
};

/**
 * Chuẩn hóa dữ liệu đọc từ Firestore hoặc LocalStorage
 */
export function normalizeBioData(raw = {}) {
  // Nếu dữ liệu cũ của Zalo có dạng "Nguyễn Văn A (0901234567)", tách bỏ phần số điện thoại để chỉ hiện tên
  const rawZaloName = raw.socials?.zalo?.displayName || DEFAULT_BIO_DATA.socials.zalo.displayName;
  const cleanZaloName = rawZaloName.replace(/\s*\([0-9+\s.]+\)\s*$/, '').trim() || DEFAULT_BIO_DATA.name;

  return {
    ...DEFAULT_BIO_DATA,
    ...raw,
    adminPassword: raw.adminPassword || DEFAULT_BIO_DATA.adminPassword,
    socials: {
      zalo: {
        ...DEFAULT_BIO_DATA.socials.zalo,
        ...(raw.socials?.zalo || {}),
        displayName: cleanZaloName,
      },
      facebook: {
        ...DEFAULT_BIO_DATA.socials.facebook,
        ...(raw.socials?.facebook || {}),
      },
      instagram: {
        ...DEFAULT_BIO_DATA.socials.instagram,
        ...(raw.socials?.instagram || {}),
      },
      tiktok: {
        ...DEFAULT_BIO_DATA.socials.tiktok,
        ...(raw.socials?.tiktok || {}),
      },
      threads: {
        ...DEFAULT_BIO_DATA.socials.threads,
        ...(raw.socials?.threads || {}),
      },
      locket: {
        ...DEFAULT_BIO_DATA.socials.locket,
        ...(raw.socials?.locket || {}),
      },
    },
    bank: {
      ...DEFAULT_BIO_DATA.bank,
      ...(raw.bank || {}),
    },
  };
}

export function getLocalBioData() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return normalizeBioData(JSON.parse(saved));
    }
  } catch (err) {
    console.warn('Lỗi đọc LocalStorage:', err);
  }
  return DEFAULT_BIO_DATA;
}

export function setLocalBioData(data) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Lỗi ghi LocalStorage:', err);
  }
}

export function subscribeToBioProfile(onDataChange, onStatusChange) {
  const initialData = getLocalBioData();
  onDataChange(initialData);

  if (!isFirebaseConfigured || !db) {
    onStatusChange?.({ connected: false, mode: 'local' });
    return () => {};
  }

  const docRef = doc(db, BIO_COLLECTION, BIO_DOCUMENT_ID);

  const unsubscribe = onSnapshot(
    docRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        const remoteData = normalizeBioData(snapshot.data());
        setLocalBioData(remoteData);
        onDataChange(remoteData);
        onStatusChange?.({ connected: true, mode: 'firebase' });
      } else {
        try {
          await setDoc(docRef, initialData);
          onStatusChange?.({ connected: true, mode: 'firebase' });
        } catch (writeErr) {
          console.warn('Chưa thể tạo document mặc định trên Firestore:', writeErr);
          onStatusChange?.({ connected: true, mode: 'firebase-readonly' });
        }
      }
    },
    (error) => {
      console.warn('Lỗi kết nối Firestore, dùng dữ liệu dự phòng:', error);
      onStatusChange?.({ connected: false, mode: 'local', error: error.message });
    }
  );

  return unsubscribe;
}

export async function updateBioProfile(newData) {
  const payload = normalizeBioData({
    ...newData,
    updatedAt: new Date().toISOString(),
  });

  setLocalBioData(payload);

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, BIO_COLLECTION, BIO_DOCUMENT_ID);
    await setDoc(docRef, payload, { merge: true });
    return { savedToFirebase: true, data: payload };
  }

  return { savedToFirebase: false, data: payload };
}

export function compressImageFile(file, { maxWidth = 900, maxHeight = 900, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Không có file được chọn'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Không thể đọc định dạng ảnh này'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('Lỗi khi đọc file từ thiết bị'));
    reader.readAsDataURL(file);
  });
}
