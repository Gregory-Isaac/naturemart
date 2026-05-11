import axios from "axios";

const API = axios.create({
  // Local development — Flask on port 5001 with SQLite
  baseURL: "http://127.0.0.1:5001/api",
  // Production (AlwaysData) — uncomment when deploying:
  // baseURL: "http://gregoryisaac.alwaysdata.net/api",
});

// Add a request interceptor to attach the token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;