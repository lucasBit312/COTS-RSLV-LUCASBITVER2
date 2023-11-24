import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { logout } from "../features/Auth/userSlide";
import { useDispatch } from "react-redux";

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    headers: {
        'Content-Type': 'application/json',
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
        console.log(response)
        return response.data;
    },
    function (error) {
        let errorData = {
            status: "error",
            message: "Lỗi không xác định từ máy chủ"
        };
        if (error.response) {
            const responseData = error.response.data;
            console.log("ERROR RESPONSE: ", responseData);
            if (responseData.error == 'Authorization error') {
                enqueueSnackbar("Vui Lòng Đăng Nhập", { variant: 'error' });
            } else if (responseData.error == 'Token has expired') {
                const dispatch = useDispatch();
                const action = logout();
                dispatch(action);
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
