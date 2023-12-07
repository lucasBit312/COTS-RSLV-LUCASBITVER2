import axiosClient from "./axiosClient";
const userApi = {
    register(data) {
        const url = '/api/auth/register';
        return axiosClient.post(url, data);
    },

    login(data) {
        const url = '/api/auth/login';
        return axiosClient.post(url, data);
    },
    editProfice(data) {
        const url = '/api/edit-profice';
        return axiosClient.post(url, data);
    },
    getProfice() {
        const url = '/api/get-profice';
        return axiosClient.get(url);
    },
    newImage(data) {
        const url = '/api/new-image-profice';
        const headers = {
            "Content-Type": "multipart/form-data"
        };
        return axiosClient.post(url, data, { headers });
    },
    newPassword(data) {
        const url = '/api/new-password';
        return axiosClient.post(url, data);
    },
    getCountNotication() {
        const url = '/api/get-count-notication';
        return axiosClient.get(url);
    }
}
export default userApi;