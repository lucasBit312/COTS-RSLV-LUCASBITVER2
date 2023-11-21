import axios from "axios";
import axiosClient from "./axiosClient";

const locationApi = {
    getProvince(params) {
        const url = '/api/provinces';
        return axiosClient.get(url, { params });
    },
    getDistricts(provinceID) {
        const url = `/api/getAllDistrictOfProvinceId/${ provinceID }`;
        return axiosClient.get(url);
    },
    getWards(DistrictID) {
        const url = `/api/getAllWardOfDistrictId/${ DistrictID }`;
        return axiosClient.get(url);
    },
}
export default locationApi;