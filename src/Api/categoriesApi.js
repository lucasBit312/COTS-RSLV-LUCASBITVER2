import axios from "axios";
import axiosClient from "./axiosClient";

const categoriesApi = {
    getCategories(params) {
        const url = '/api/categories';
        return axiosClient.get(url, { params });
    },
}
export default categoriesApi;