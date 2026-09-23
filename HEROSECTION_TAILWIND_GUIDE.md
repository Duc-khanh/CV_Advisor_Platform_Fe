# 🚀 HeroSection Tailwind CSS - Hướng dẫn sử dụng

## 📋 Các bước setup và sử dụng

### 1. **Kiểm tra Tailwind CSS & Dependencies**
Component này đã sử dụng:
- ✅ **Tailwind CSS 4.x** (vừa cài đặt)
- ✅ **lucide-react** (đã có trong project)
- ✅ **framer-motion** (đã có trong project)
- ✅ **react-router-dom** (đã có trong project)

### 2. **Thay thế HeroSection cũ bằng cái mới**

**Option A: Thay thế trực tiếp (Recommended)**
```bash
# Backup component cũ
cp src/pages/user/HeroSection.jsx src/pages/user/HeroSection_MUI_backup.jsx

# Copy component mới
cp src/pages/user/HeroSection_Tailwind.jsx src/pages/user/HeroSection.jsx
```

**Option B: Giữ cả hai và chọn một trong imports**
- Giữ `HeroSection_Tailwind.jsx` là version mới
- Sử dụng nó trong `src/pages/user/UserHome.jsx` hoặc tệp gọi nó

### 3. **Cập nhật imports nếu cần**
Nếu giữ tên file khác, hãy cập nhật import ở file sử dụng:

```jsx
// src/pages/user/UserHome.jsx (hoặc tệp khác)
import HeroSection from './HeroSection_Tailwind'; // hoặc './HeroSection'
```

### 4. **Sử dụng component**
```jsx
<HeroSection 
  searchQuery={{ keyword: '', location: '' }}
  setSearchQuery={(query) => console.log(query)}
  onSearch={() => console.log('Searching...')}
/>
```

---

## ✨ Các tính năng chính

### 🎨 **Navbar**
- Logo CareerGo với gradient
- Menu navigation căn giữa (Desktop only)
- Nút "Nhà tuyển dụng" outline
- Avatar user góc phải
- Mobile-friendly (menu icon ẩn/hiện)

### 🔍 **Search Bar**
- **50%** Input keyword/skill
- **30%** Input location
- **20%** Button "Tìm việc ngay"
- Chiều cao tối thiểu 56px
- Shadow mượt: `shadow-lg shadow-blue-500/5`
- Rounded: `rounded-2xl`
- Hỗ trợ Enter key search

### 🏷️ **Popular Tags**
- Dạng pill: `rounded-full`
- Hover effect: `hover:bg-blue-50 hover:text-blue-600`
- Animate on load
- Click để search

### 🤖 **AI Matching Dashboard (Right)**
- Glassmorphism card: `bg-white/80 backdrop-blur-md`
- **Badge**: "AI CV Match" + "92% Phù hợp" (emerald)
- **Job Card**: 
  - Tiêu đề: "Frontend Developer (React/Next.js)"
  - Company + Location
  - Progress bar gradient (0-92%)
- **Metrics Grid**:
  - Card 1: "1.248+ Việc làm mới" (+14% tuần này)
  - Card 2: "568+ Doanh nghiệp uy tín" (Đang tuyển dụng)

### 💌 **Floating CV Result Bar**
- **Fixed position**: `fixed bottom-6 z-50`
- **Hai trạng thái**:
  
  **Mở (default)**:
  - Icon Sparkles ✨
  - Text: "Kết quả CV gần nhất: **85/100 điểm**"
  - 3 nút action:
    - "Xem chi tiết" (pill button chữ xanh)
    - Thu gọn (ChevronDown icon)
    - Đóng (X icon)
  
  **Thu gọn (minimized)**:
  - Tự động co lại thành pill nổi ở góc phải dưới: `fixed bottom-6 right-6`
  - Hiển thị: "Điểm CV: 85/100" + ChevronUp
  - Click để mở lại

---

## 🎯 **Tối ưu Responsive**

| Screen | Behavior |
|--------|----------|
| Mobile (< 640px) | Navbar logo chỉ hiện "C" + Avatar, Search bar full width, Tags wrap |
| Tablet (640px - 1024px) | Navbar logo hiện chữ, Search bar flex hàng |
| Desktop (> 1024px) | Full layout, Dashboard ở cột 2, Menu hiện hết |

---

## 🔧 **Tùy chỉnh Tailwind Classes**

### Nếu muốn đổi màu sắc:
Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      // Thay đổi tại đây
      blue: { 600: '#2563eb' }, // Thay đổi primary color
    }
  }
}
```

### Nếu muốn thay đổi animations:
- Tất cả animations là Framer Motion
- Tìm `initial={{ ... }}`, `animate={{ ... }}`, `transition={{ ... }}`

---

## 🚨 **Lưu ý quan trọng**

1. **Tailwind CSS phải được configure đúng** ✅ (đã setup)
2. **lucide-react phải được import** ✅ (đã có trong project)
3. **React Router phải setup** ✅ (đã có)
4. **Framer Motion phải có** ✅ (đã có)

---

## 📝 **Danh sách Props**

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `searchQuery` | Object | `{}` | `{ keyword: '', location: '' }` |
| `setSearchQuery` | Function | `() => {}` | Callback khi user nhập search |
| `onSearch` | Function | `() => {}` | Callback khi user click "Tìm việc" |

---

## ✅ **Checklist**

- [x] Tailwind CSS cài đặt
- [x] Component Tailwind tạo
- [x] Navbar responsive
- [x] Search bar 3-section layout
- [x] Popular tags interactive
- [x] Glassmorphism dashboard
- [x] Floating CV bar (mở/thu gọn)
- [x] Smooth animations
- [x] Mobile-first approach

---

## 🎬 **Build & Test**

```bash
# Dev server
npm run dev

# Build production
npm run build

# Preview
npm run preview
```

---

Thưởng thức component mới! 🎉
