import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "https://sundarban-development-internship-project.onrender.com",
  withCredentials: true,
});

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
