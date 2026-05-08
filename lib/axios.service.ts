import axios from "axios";
import useAuthStore from "./store/authStore";


export default function useAxios() {
    const { accessToken, setAccessToken } = useAuthStore();
    const apiPrivate = axios.create({
        baseURL: "/api",
        timeout: 20000
    });


    const apiPublic = axios.create({
        baseURL: "/api",
        timeout: 20000
    });
    apiPrivate.interceptors.request.use(
        async (config) => {
            config.headers.Authorization = `Bearer ${accessToken}`;
            return config;
        },
        (error) => Promise.reject(error)
    );


    apiPrivate.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;


            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const response = await apiPublic.post("/refreshToken", { withCredentials: true });

                    const { accessToken: token } = response.data;
                    console.log("AccessToken Baru: ", accessToken);

                    setAccessToken(token);
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiPrivate(originalRequest);

                } catch (refreshError) {
                    console.error("Refresh token expired. Logging out...");
                    localStorage.removeItem("token");
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return {
        apiPrivate,
        apiPublic
    }
}