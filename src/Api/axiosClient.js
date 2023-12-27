import axios from "axios";
import { enqueueSnackbar } from "notistack";

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    headers: {
        "content-type": "application/json",
        "Accept": "application/json"
    },
});

axiosClient.interceptors.request.use(
    function (config) {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);
axiosClient.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        let errorData = {
            status: "error",
            message: "Lỗi không xác định từ máy chủ"
        };
        if (error.response) {
            const responseData = error.response.data;
            if (responseData.error == 'Authorization error') {
                enqueueSnackbar("Vui Lòng Đăng Nhập", { variant: 'error' });
            }
            errorData = responseData;
        } else {
            console.log("Network Error:", error.message);
        }

        return Promise.reject(errorData);
    }
);

export default axiosClient;
