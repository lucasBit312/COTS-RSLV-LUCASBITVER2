import axios from "axios";
import axiosClient from "./axiosClient";

const locationApi = {
    getFoodLocations(params) {
        const url = '/api/locations';
        return axiosClient.get(url, { params });
    },
    getDetailLocation(locationId) {
        const url = `/api/getDetailLocation/${locationId}`;
        return axiosClient.get(url);
    },
}
export default locationApi;