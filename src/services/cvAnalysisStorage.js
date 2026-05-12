/**
 * cvAnalysisStorage.js
 * Quản lý lưu/đọc kết quả phân tích CV theo từng userId.
 * Key localStorage: `cvAnalysis_<userId>`
 * Nếu chưa đăng nhập (guest) thì không lưu.
 */

/**
 * Lấy userId từ JWT token trong localStorage.
 * JWT payload thường chứa "sub" (subject) = username/email, hoặc "userId".
 * Trả về null nếu chưa đăng nhập hoặc token không hợp lệ.
 */
export function getCurrentUserId() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    // Decode phần payload (base64)
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    // Spring Boot JWT thường dùng "sub" = email/username, hoặc "userId"
    return payload.userId || payload.sub || null;
  } catch {
    return null;
  }
}

/** Tạo key localStorage cho user hiện tại */
function getStorageKey(userId) {
  return `cvAnalysis_${userId}`;
}

/**
 * Lưu kết quả phân tích CV cho user đang đăng nhập.
 * @param {{ analysis, summary, recommendedJobs }} data
 */
export function saveCvAnalysis(data) {
  const userId = getCurrentUserId();
  if (!userId) return; // Không lưu nếu chưa đăng nhập

  const key = getStorageKey(userId);
  const payload = {
    ...data,
    createdAt: Date.now(),
    userId,
  };
  localStorage.setItem(key, JSON.stringify(payload));
}

/**
 * Đọc kết quả phân tích CV của user đang đăng nhập.
 * Trả về null nếu chưa có hoặc chưa đăng nhập.
 */
export function loadCvAnalysis() {
  const userId = getCurrentUserId();
  if (!userId) return null;

  const key = getStorageKey(userId);
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);
    // Chỉ trả về nếu đúng userId (bảo vệ thêm)
    if (data.userId && data.userId !== userId) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Xoá kết quả phân tích CV của user đang đăng nhập.
 */
export function clearCvAnalysis() {
  const userId = getCurrentUserId();
  if (!userId) return;
  localStorage.removeItem(getStorageKey(userId));
}

/**
 * Xoá key cũ không có userId (migration từ version cũ).
 * Gọi 1 lần khi app khởi động.
 */
export function migrateLegacyStorage() {
  const legacy = localStorage.getItem('lastCvAnalysis');
  if (legacy) {
    // Chỉ giữ lại nếu user hiện tại đang đăng nhập — gán cho họ
    const userId = getCurrentUserId();
    if (userId) {
      const key = getStorageKey(userId);
      // Chỉ migrate nếu chưa có key mới
      if (!localStorage.getItem(key)) {
        try {
          const parsed = JSON.parse(legacy);
          localStorage.setItem(key, JSON.stringify({ ...parsed, userId }));
        } catch { /* bỏ qua */ }
      }
    }
    // Xoá key cũ dù sao
    localStorage.removeItem('lastCvAnalysis');
  }
}
