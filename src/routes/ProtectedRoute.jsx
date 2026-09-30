import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const LOGIN_REQUIRED_MESSAGE = "Bạn cần đăng nhập để sử dụng tính năng này.";
const SESSION_EXPIRED_MESSAGE = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";

const ROLE_HOME = {
  ADMIN: "/admin_dashboard",
  HR: "/hr_dashboard",
  USER: "/",
};

const normalizeRole = (value) => value?.toUpperCase().replace(/^ROLE_/, "");

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export default function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const [mountedAt] = useState(Date.now);
  const token = localStorage.getItem("token");

  const redirectToLogin = (message) => (
    <Navigate
      to="/login"
      replace
      state={{
        authMessage: message,
        returnTo: `${location.pathname}${location.search}${location.hash}`,
      }}
    />
  );

  if (!token) {
    return redirectToLogin(LOGIN_REQUIRED_MESSAGE);
  }

  const decoded = decodeToken(token);
  const isExpired = decoded?.exp && decoded.exp * 1000 <= mountedAt;

  if (!decoded || isExpired) {
    localStorage.removeItem("token");
    return redirectToLogin(SESSION_EXPIRED_MESSAGE);
  }

  const currentRole = normalizeRole(decoded.role);
  const requiredRole = normalizeRole(role);

  if (requiredRole && currentRole !== requiredRole) {
    return <Navigate to={ROLE_HOME[currentRole] || "/login"} replace />;
  }

  return children;
}
