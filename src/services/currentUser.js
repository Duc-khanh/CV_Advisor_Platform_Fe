import axios from "axios";

const API_URL = "http://localhost:8080/api/me";

// Cấu hình Header lấy Token từ localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

/**
 * Lấy thông tin cá nhân của người dùng hiện tại
 * Dùng để hiển thị ở AdminHeader hoặc trang Profile
 */
export const getCurrentUser = async () => {
    try {
        const res = await axios.get(API_URL, getAuthHeader());
        return res;
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
    }
};

/**
 * Cập nhật thông tin cá nhân
 * @param {Object} data - Chứa { fullName, email, ... }
 * @param {File} avatarFile - File ảnh từ input
 */
export const updateCurrentUser = async (data, avatarFile) => {
    const formData = new FormData();

    // Chuyển object data thành Blob định dạng JSON để Spring Boot @RequestPart hiểu được
    formData.append(
        "data",
        new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    // Nếu có chọn ảnh mới thì mới đính kèm vào formData
    if (avatarFile) {
        formData.append("avatar", avatarFile);
    }

    return await axios.put(API_URL, formData, {
        headers: {
            ...getAuthHeader().headers,
            "Content-Type": "multipart/form-data",
        },
    });
};