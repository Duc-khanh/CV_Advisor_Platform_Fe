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
  export const getUsers = async (params) => {
    const res = await axios.get(API_URL, {
      ...getAuthHeader(),
      params: params // Truyền { search, role, enabled, page, size }
    });
    return res.data; // Trả về object có { content, totalElements, totalPages, ... }
  };
