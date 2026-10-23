# 📱 NFC_BIO — Website Bio Cá Nhân Tối Ưu Cho Điện Thoại

Website Bio cá nhân thông minh được thiết kế theo phong cách trang cá nhân hiện đại (ảnh đại diện chồng 1/2 lên ảnh bìa, danh sách mạng xã hội xếp dọc, chuyển đổi nền sáng xanh dương dịu mắt / nền tối dịu, hiệu ứng tuyết rơi & bông tuyết xuất hiện khi chạm màn hình). Khi quét hoặc chạm điện thoại vào thẻ NFC, trang Bio sẽ mở trực tiếp trên trình duyệt.

---

## ✨ Tính năng nổi bật

1. **Giao diện chuẩn điện thoại dọc**:
   - **Ảnh bìa (Cover)**: Nằm ở đầu trang, chiếm khoảng `1/4` đến `1/3` màn hình điện thoại, có nút **Đổi ảnh bìa** tải trực tiếp từ thư viện/camera điện thoại.
   - **Ảnh đại diện (Avatar)**: Nằm chính giữa theo chiều ngang, một nửa nằm trên ảnh bìa và một nửa nằm ở khu vực nội dung bên dưới, có nút máy ảnh để tải ảnh đại diện mới từ điện thoại.
   - **Tên cá nhân & Lưu danh bạ**: Hiển thị tên cá nhân, tiểu sử ngắn và nút xuất tệp danh bạ `.vcf` (vCard) giúp người quét thẻ NFC lưu số điện thoại chỉ với 1 chạm.
2. **Danh sách thông tin & mạng xã hội xếp dọc**:
   - **Số điện thoại**: Hiển thị trực tiếp, nhấn vào để gọi ngay (`tel:`).
   - **Email**: Hiển thị địa chỉ email, nhấn vào để mở ứng dụng gửi mail (`mailto:`).
   - **Zalo**: Hiển thị logo Zalo, tên và số điện thoại, nhấn vào mở hồ sơ Zalo (`https://zalo.me/...`).
   - **Facebook, Instagram, TikTok, Threads**: Hiển thị logo, tên mạng xã hội và tên tài khoản tương ứng, nhấn vào mở liên kết trực tiếp.
3. **Hai chế độ màu sắc dịu mắt**:
   - **Chế độ sáng (mặc định)**: Tông xanh dương nhạt (`#e8f3fc`) dịu mắt.
   - **Chế độ tối**: Tông tối vừa phải (`#1e293b` / `#273549`), không sử dụng màu đen quá đậm.
4. **Hiệu ứng tuyết rơi tương tác (`SnowEffect.jsx`)**:
   - Tuyết rơi nền nhẹ nhàng trên màn hình điện thoại.
   - Khi chạm/nhấn vào bất kỳ vị trí nào trên màn hình, các bông tuyết tinh thể xuất hiện tại vị trí đó rồi từ từ biến mất.
   - Sử dụng `pointer-events: none` nên hoàn toàn không che khuất thông tin hay cản trở việc nhấn các liên kết.
5. **Lưu trữ Firebase Firestore & Khóa PIN bảo vệ**:
   - Tự động đồng bộ dữ liệu trực tuyến với **Firebase Firestore** (kèm cơ chế lưu dự phòng `localStorage` để phản hồi tức thì).
   - Bảo vệ quyền chỉnh sửa thông tin và tải ảnh bằng **Mã PIN chủ sở hữu** (mặc định: `1234`, có thể tùy chỉnh qua biến môi trường `VITE_ADMIN_PIN`).

---

## 📂 Cấu trúc thư mục dự án

```text
nfc-bio-app/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── avatar.jpg
│   ├── cover.jpg
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── HeaderProfile.jsx
│   │   ├── SocialItem.jsx
│   │   ├── SocialList.jsx
│   │   ├── SnowEffect.jsx
│   │   └── ThemeToggle.jsx
│   ├── config/
│   │   └── firebase.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Hướng dẫn cài đặt và chạy trên máy

### 1. Cài đặt thư viện
```bash
npm install
```

### 2. Chạy môi trường phát triển (Development)
```bash
npm run dev
```

### 3. Đóng gói sản phẩm (Production Build)
```bash
npm run build
```

---

## 🔥 Cấu hình Firebase Firestore

1. Truy cập [Firebase Console](https://console.firebase.google.com/) và tạo một Project mới.
2. Vào mục **Build > Firestore Database** và nhấn **Create database**.
3. Tạo file `.env` ở thư mục gốc của dự án (hoặc cấu hình trong GitHub Secrets khi triển khai GitHub Pages):

```env
VITE_FIREBASE_API_KEY=AIzaSyYourApiKey...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
VITE_ADMIN_PIN=1234
```

### Quy tắc bảo mật Firestore (Firestore Security Rules)
Trong tab **Rules** của Firestore Database, thiết lập quy tắc để mọi người quét thẻ NFC đều đọc được trang Bio:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bio_profiles/{documentId} {
      allow read: if true;
      allow write: if true; // Hoặc giới hạn theo Firebase Authentication nếu cần bảo mật nâng cao
    }
  }
}
```

---

## 🌐 Triển khai lên GitHub Pages và Ghi thẻ NFC

1. Đẩy mã nguồn lên GitHub repository của bạn.
2. Trên GitHub repository, vào **Settings > Pages**, tại mục **Build and deployment > Source**, chọn **GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` sẽ tự động build và xuất bản trang web tại địa chỉ `https://<username>.github.io/<repo-name>/`.
4. Tải ứng dụng **NFC Tools** trên điện thoại (iOS / Android):
   - Chọn **Write** -> **Add a record** -> **URL / URI**.
   - Nhập đường dẫn GitHub Pages của bạn vào.
   - Nhấn **Write** và chạm thẻ NFC vào mặt sau điện thoại để hoàn tất!
