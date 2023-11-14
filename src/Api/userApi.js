import axiosClient from "./axiosClient";
const userApi = {
    register(data) {
        const url = '/api/auth/register';
        return axiosClient.post(url, data);
    },

    login(data) {
        const url = '/api/auth/login';
        return axiosClient.post(url, data);
    }
    
}
export default userApi;