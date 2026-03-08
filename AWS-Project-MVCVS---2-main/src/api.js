import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8080/api"
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mvcvs_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect
      localStorage.removeItem("mvcvs_token");
      localStorage.removeItem("mvcvs_user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default api;

