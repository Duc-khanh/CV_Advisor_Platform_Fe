import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const STAFF_HOME = {
  ADMIN: "/admin_dashboard",
  HR: "/hr_dashboard",
};

const normalizeRole = (role) => role?.toUpperCase().replace(/^ROLE_/, "");

export default function CandidateAreaRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) return children;

  try {
    const decoded = jwtDecode(token);
    const expired = decoded?.exp && decoded.exp * 1000 <= Date.now();

    if (expired) {
      localStorage.removeItem("token");
      return children;
    }

    const staffHome = STAFF_HOME[normalizeRole(decoded?.role)];
    return staffHome ? <Navigate to={staffHome} replace /> : children;
  } catch {
    localStorage.removeItem("token");
    return children;
  }
}
