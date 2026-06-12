import axios from "axios";

const apiTest = axios.create({
  baseURL: "https://presensi.polines.ac.id/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiTest.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiTest;
