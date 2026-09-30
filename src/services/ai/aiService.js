import axios from '../axios'; // Assuming this is an axios instance with baseUrl configured

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
export const filterCvs = async () => {
    throw new Error('Tính năng lọc CV chưa được hỗ trợ.');
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

/**
 * Khởi tạo bộ câu hỏi phỏng vấn mô phỏng dựa trên CV và thông tin tuyển dụng.
 * @param {File|null} cvFile - File CV (tùy chọn)
 * @param {string} targetRole - Vị trí mục tiêu
 * @param {string} jobDescription - Mô tả công việc (JD)
 * @param {string} experienceLevel - Cấp bậc (Fresher, Junior, Mid, Senior, Lead)
 * @param {string} interviewType - Loại hình phỏng vấn
 * @param {number} questionCount - Số lượng câu hỏi (3 - 7)
 * @returns {Promise} - Kịch bản phỏng vấn
 */
export const generateAiInterview = async (
    cvFile,
    targetRole = '',
    jobDescription = '',
    experienceLevel = 'Mid-Level',
    interviewType = 'Chuyên môn kỹ thuật',
    questionCount = 5
) => {
    try {
        const formData = new FormData();
        if (cvFile) {
            formData.append('cv', cvFile);
        }
        formData.append('targetRole', targetRole);
        formData.append('jobDescription', jobDescription);
        formData.append('experienceLevel', experienceLevel);
        formData.append('interviewType', interviewType);
        formData.append('questionCount', String(questionCount));

        const response = await axios.post('/api/v1/ai/interview/generate', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi khởi tạo buổi phỏng vấn AI:', error);
        throw error;
    }
};

/**
 * Đánh giá và chấm điểm toàn bộ câu trả lời phỏng vấn theo chuẩn STAR.
 * @param {string} targetRole - Vị trí phỏng vấn
 * @param {string} experienceLevel - Cấp bậc
 * @param {Array} answers - Danh sách câu hỏi và câu trả lời của ứng viên
 * @returns {Promise} - Bảng điểm và nhận xét chi tiết
 */
export const evaluateAiInterview = async (targetRole, experienceLevel, answers) => {
    try {
        const payload = {
            targetRole,
            experienceLevel,
            answers,
        };
        const response = await axios.post('/api/v1/ai/interview/evaluate', payload);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi chấm điểm phỏng vấn AI:', error);
        throw error;
    }
};
