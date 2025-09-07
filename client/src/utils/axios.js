// src/utils/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://sundarban-development-internship-project.onrender.com",
  withCredentials: true, // always send cookies
});

// optional: auto-redirect on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
