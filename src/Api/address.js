
import axiosClient from "./axiosClient";
const addressApi = {
    getAllAddress(data) {
        const url = '/api/get-all-address';
        return axiosClient.get(url, data);
    },

    addNewAddress(data) {
        const url = '/api/add-new-address';
        return axiosClient.post(url, data);
    },
}
export default addressApi;