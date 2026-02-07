import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

// Logic: Before every request, check if we have a token and add it to the header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;