import axios from '@/src/config/axios.config'

const api = axios;

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Kiểm tra loại dữ liệu để set Content-Type phù hợp
        const isFormData = config.data instanceof FormData;
        if (isFormData) {
            // Để axios tự động set multipart/form-data với boundary
            delete config.headers["Content-Type"];
        } else {
            // Set JSON cho các request khác
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                window.location.href = "/";
                return Promise.reject(error);
            }
            originalRequest._retry = true;

            try {
                const { data } = await axios.post("/auth/refresh");
                localStorage.setItem("accessToken", data.data.access_token);
                originalRequest.headers.Authorization = `Bearer ${data.data.access_token}`;
                return axios(originalRequest);
            } catch (err) {
                console.error("Refresh token failed:", err);
                localStorage.removeItem("accessToken");
                window.location.href = "/";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
