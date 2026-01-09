import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchQuizzes = async (videoId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/quizzes/${videoId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        return [];
    }
};