import axios from 'axios';

const API = axios.create({
    baseURL: 'https://vehicle-management-ghs2.onrender.com/api',
});

API.interceptors.request.use((req) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
    }
    return req;
});

export default API;
