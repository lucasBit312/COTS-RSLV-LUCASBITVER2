import axios from "axios";
import axiosClient from "./axiosClient";

const cartApi = {
    addToCartAPI(value) {
        const url = `/api/addToCart`;
        const user = JSON.parse(localStorage.getItem('user'));
        const data = { value };
        if (user) {
            data.user = user;
        }
        return axiosClient.post(url, data);
    },
    getTotalCart() {
        const user = JSON.parse(localStorage.getItem('user'));
        const url = `/api/getTotalCart/${user.id}`;
        return axiosClient.get(url);
    },
    getReceivedList(params) {
        const url = `/api/getReceivedList`;
        return axiosClient.get(url, { params });
    },
    cancelReceived(received_id) {
        const url = `/api/cancelReceived`;
        const user = JSON.parse(localStorage.getItem('user'));
        return axiosClient.post(url, received_id, user);
    }
}
export default cartApi;