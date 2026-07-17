  import axios from "axios";

  const API_URL = "http://localhost:8080/api/admin/users";

  // Lấy token
  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // // Lấy danh sách user
  // export const getUsers = async () => {
  //   const res = await axios.get(API_URL, getAuthHeader());
  //   return res.data;
  // };

  // Thêm user
  export const createUser = async (user) => {
    const res = await axios.post(API_URL, user, getAuthHeader());
    return res.data;
  };

  // Xoá user
  export const deleteUser = async (id) => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  };

  export const updateUser = async (id, formData) => {
    const res = await axios.put(`${API_URL}/${id}`, formData, getAuthHeader());
    return res.data;
  };

  export const toggleUserStatus = async (id) => {
    // Khớp với @PutMapping("/{id}/toggle-status") trong Controller của bạn
    await axios.put(`${API_URL}/${id}/toggle-status`, {}, getAuthHeader());
  };

  export const approveHr = async (id, status) => {
    const res = await axios.put(`${API_URL}/${id}/hr-approval`, {}, {
      ...getAuthHeader(),
      params: { status }
    });
    return res.data;
  };

  export const getUsers = async (params) => {
    const res = await axios.get(API_URL, {
      ...getAuthHeader(),
      params: params // Truyền { search, role, enabled, page, size }
    });
    return res.data; // Trả về object có { content, totalElements, totalPages, ... }
  };

  // Lấy toàn bộ danh sách công ty công khai
  export const getCompanies = async () => {
    const res = await axios.get("http://localhost:8080/api/public/companies");
    return res.data;
  };

  // Thêm nhanh công ty (từ Admin)
  export const createCompany = async (companyData) => {
    const res = await axios.post("http://localhost:8080/api/admin/companies", companyData, getAuthHeader());
    return res.data;
  };

  // Lấy toàn bộ ngành nghề (từ Admin)
  export const getIndustries = async () => {
    const res = await axios.get("http://localhost:8080/api/admin/industries", getAuthHeader());
    return res.data;
  };
