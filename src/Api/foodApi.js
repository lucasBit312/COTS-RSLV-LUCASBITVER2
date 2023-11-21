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
}
export default foodAip;