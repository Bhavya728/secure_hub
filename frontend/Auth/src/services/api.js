import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // 🔥 REQUIRED FOR COOKIES
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   RESPONSE INTERCEPTOR
   Handle auth errors
========================= */
api.interceptors.response.use(
  (res) => res,
  async (err) => {
   
    return Promise.reject(err);
  }
);

export default api;
