import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Добавя accessToken към всяка заявка
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// При 401 се опитва да refresh-не токена веднъж
let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  pendingQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        processQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
