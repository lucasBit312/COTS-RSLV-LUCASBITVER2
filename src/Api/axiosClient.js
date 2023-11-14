import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

axiosClient.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    let errorData = {
        status: "error",
        message: "Lỗi không xác định từ máy chủ"
    };

    if (error.response) {
        const responseData = error.response.data;
        console.log("ERROR RESPONSE: ", responseData);
        errorData = responseData;
    } else {
        console.log("Network Error:", error.message);
    }

    return Promise.reject(errorData);
});

export default axiosClient;
