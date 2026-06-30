import axios from './axios'; // Assuming this is an axios instance with baseUrl configured

/**
 * Gọi API để AI đánh giá CV bằng file upload.
 * @param {File} cvFile - File CV (PDF/DOC/DOCX)
 * @param {string} jobDescription - Mô tả vị trí mục tiêu hoặc vai trò mong muốn
 * @returns {Promise} - Kết quả trả về từ AI
 */
export const evaluateCvFile = async (cvFile, jobDescription = '') => {
    try {
        const formData = new FormData();
        formData.append('cv', cvFile);
        if (jobDescription) {
            formData.append('targetRole', jobDescription);
            formData.append('jobDescription', jobDescription);
        }

        const response = await axios.post('/api/v1/ai/evaluate-cv', formData);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi AI đánh giá CV:", error);
        throw error;
    }
};

/**
 * Gọi API để lọc CV (Có thể phát triển thêm)
 */
export const filterCvs = async (cvContents, criteria) => {
    // Tương lai bạn có thể thêm endpoint này ở Backend
    // return await axios.post('/ai/filter-cvs', { cvContents, criteria });
};

/**
 * Gọi API để tạo lộ trình học tập dựa trên CV file và vị trí mục tiêu.
 * @param {File} cvFile - File CV upload
 * @param {string} targetRole - Vị trí mục tiêu (tùy chọn)
 * @param {string} desiredRoadmap - Lộ trình mong muốn của người dùng
 * @returns {Promise} - Lộ trình học tập được đề xuất
 */
export const generateCareerRoadmap = async (cvFile, targetRole = '', desiredRoadmap = '') => {
    try {
        const formData = new FormData();
        formData.append('cv', cvFile);
        if (targetRole) {
            formData.append('targetRole', targetRole);
            formData.append('jobDescription', targetRole);
        }
        if (desiredRoadmap) {
            formData.append('desiredRoadmap', desiredRoadmap);
            formData.append('roadmapGoal', desiredRoadmap);
        }

        const response = await axios.post('/api/v1/ai/career-roadmap', formData);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo lộ trình học tập:", error);
        throw error;
    }
};
