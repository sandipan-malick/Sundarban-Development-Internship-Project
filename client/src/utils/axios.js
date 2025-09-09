// src/utils/axios.js
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "https://sundarban-development-internship-project.onrender.com",
  withCredentials: true, // always send cookies
});

// Optional: auto-redirect on 401 (unauthorized)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/login"; // force redirect to login
    }
    return Promise.reject(err);
  }
);

export default api;
