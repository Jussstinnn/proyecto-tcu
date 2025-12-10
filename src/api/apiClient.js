import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // tu backend Node
});

// Inserta el token en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
