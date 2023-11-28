import axios from "axios";
import axiosClient from "./axiosClient";

const foodAip = {
    getAll(params) {
        const url = '/api/foods';
        return axiosClient.get(url, { params });
    },
    getDetail(foodId) {
        const url = `/api/foods/${foodId}`;
        return axiosClient.get(url);
    },
    donateFoodApi(data) {
        const url = '/api/donate-food';
        const headers = {
            "Content-Type": "multipart/form-data"
        };
        return axiosClient.post(url, data, { headers });
    }
}
export default foodAip;