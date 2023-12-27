import axios from "axios";
import axiosClient from "./axiosClient";

const locationApi = {
    getFoodLocations(params) {
        const url = '/api/locations';
        return axiosClient.get(url, { params });
    },
    getDetailLocation(locationSlug) {
        const url = `/api/getDetailLocation/${locationSlug}`;
        return axiosClient.get(url);
    },
}
export default locationApi;