import axios from "axios";

const apiPolines = axios.create({
  baseURL: "https://presensi.polines.ac.id/api/telekomunikasi/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiPolines.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiPolines;
