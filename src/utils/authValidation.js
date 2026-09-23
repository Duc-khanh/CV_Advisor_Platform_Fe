/**
 * Tiện ích kiểm tra và chuẩn hóa dữ liệu xác thực & đăng ký
 */

export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Kiểm tra dữ liệu đăng ký Ứng viên
 */
export const validateCandidateRegister = ({ fullName, email, password, confirmPassword }) => {
  if (!fullName || !fullName.trim()) {
    return { isValid: false, error: "Vui lòng nhập họ và tên của bạn" };
  }

  if (!email || !isValidEmail(email)) {
    return { isValid: false, error: "Email không đúng định dạng" };
  }

  if (!password || password.length < 6) {
    return { isValid: false, error: "Mật khẩu phải có ít nhất 6 ký tự" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: "Mật khẩu nhập lại không khớp" };
  }

  return { isValid: true, error: null };
};

/**
 * Kiểm tra dữ liệu đăng ký Nhà tuyển dụng (HR/Doanh nghiệp) - Form tối giản 4 trường
 */
export const validateEmployerRegister = ({
  fullName,
  email,
  companyName,
  password,
  confirmPassword,
}) => {
  if (!fullName || !fullName.trim()) {
    return { isValid: false, error: "Vui lòng nhập họ và tên người đại diện / HR" };
  }

  if (!email || !isValidEmail(email)) {
    return { isValid: false, error: "Email doanh nghiệp không đúng định dạng" };
  }

  if (!companyName || !companyName.trim()) {
    return { isValid: false, error: "Vui lòng nhập tên công ty / doanh nghiệp" };
  }

  if (!password || password.length < 6) {
    return { isValid: false, error: "Mật khẩu phải có ít nhất 6 ký tự" };
  }

  return { isValid: true, error: null };
};

/**
 * Trích xuất thông báo lỗi chuẩn xác từ phản hồi server
 */
export const getAuthErrorMessage = (err, defaultMessage = "Thao tác thất bại. Vui lòng thử lại!") => {
  if (!err) return defaultMessage;

  const data = err.response?.data;
  if (!data) return err.message || defaultMessage;

  if (typeof data === "string") return data;
  if (data.message && typeof data.message === "string") return data.message;
  if (data.error && typeof data.error === "string") return data.error;

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.defaultMessage || e.message || e).join(", ");
  }

  if (typeof data.errors === "object" && data.errors !== null) {
    const errorVals = Object.values(data.errors);
    if (errorVals.length > 0) {
      return errorVals.join(", ");
    }
  }

  return err.response?.statusText || err.message || defaultMessage;
};
