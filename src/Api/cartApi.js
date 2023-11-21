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
    getReceivedList(){
        const url = `/api/getReceivedList`;
        const user = JSON.parse(localStorage.getItem('user'));
        return axiosClient.post(url, user);
    }
}
export default cartApi;