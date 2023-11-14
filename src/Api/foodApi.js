import axios from "axios";
import axiosClient from "./axiosClient";
import { addToCart } from "../features/Cart/CartSlide";

const foodAip = {
    getAll(params) {
        const url = '/api/foods';
        return axiosClient.get(url, { params });
    },
    getDetail(foodId) {
        const url = `/api/foods/${foodId}`;
        return axiosClient.get(url);
    },
    addToCart(foodId, quantity) {
        const url = `/api/addToCart`;
        const data = { foodId, quantity };
        const accessToken = localStorage.getItem('access_token');
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        };
        return async (dispatch) => {
            try {
                const response = await axios.post(url, data, { headers });
                dispatch(addToCart(response.cart));
                console.log('Item added to cart successfully:', response);
            } catch (error) {
                console.error('Error adding item to cart:', error);
            }
        };
    },
    
}
export default foodAip;