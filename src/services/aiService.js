import axios from './axios'; // Assuming this is an axios instance with baseUrl configured

/**
 * Gọi API để AI đánh giá CV
 * @param {string} cvContent - Nội dung text của CV ứng viên
 * @param {string} jobDescription - Nội dung text của mô tả công việc (JD)
 * @returns {Promise} - Kết quả trả về từ AI
 */
export const evaluateCv = async (cvContent, jobDescription) => {
    try {
        const response = await axios.post('/ai/evaluate-cv', {
            cvContent,
            jobDescription
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi AI:", error);
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
 * Gọi API để tạo lộ trình học tập dựa trên CV và xu hướng thị trường
 * @param {string} cvContent - Nội dung text của CV ứng viên
 * @param {string} currentSkills - Kỹ năng hiện tại từ CV
 * @param {string} targetRole - Vị trí mục tiêu (tùy chọn)
 * @returns {Promise} - Lộ trình học tập được đề xuất
 */
export const generateCareerRoadmap = async (cvContent, currentSkills, targetRole = '') => {
    try {
        const response = await axios.post('/api/v1/ai/career-roadmap', {
            cvContent,
            currentSkills,
            targetRole,
            marketTrends: "AI, Machine Learning, Cloud Computing, DevOps, Cybersecurity" // Có thể làm động sau
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo lộ trình học tập:", error);
        throw error;
    }
};
