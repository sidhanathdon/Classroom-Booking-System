import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    return res.data;
};

export const getClassrooms = async (date) => {
    const res = await axios.get(`${API_URL}/classrooms/${date}`);
    return res.data;
};

export const engageClass = async (class_id, faculty_id, engage) => {
    const res = await axios.post(`${API_URL}/engage`, { class_id, faculty_id, engage });
    return res.data;
};

export const getCourses = async (class_id) => {
    const res = await axios.get(`${API_URL}/courses/${class_id}`);
    return res.data;
};
