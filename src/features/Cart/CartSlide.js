import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        showMiniCart: false,
        cartItems: [],
    },
    reducers: {
        showMiniCart(state){
            state.showMiniCart = true;
        },
        hideMiniCart(state){
            state.showMiniCart = false;
        },
        // addToCart(state, action) {
        //     const newItem = action.payload;
        //     const index = state.cartItems.findIndex(x=>x.id === newItem.id);
            
            
        // },
        setQuantity(state, action) {
            const {id, quantity} = action.payload;
            const index = state.cartItems.findIndex((x) => x.id === id);
            if(index>=0){
                state.cartItems[index].qantity = quantity;
            }
        },
        removeFromCart(state, action){
            const idRemove = action.payload;
            state.cartItems = state.cartItems.filter(x => x.id !== idRemove);
        },
    },
});
const {actions, reducer} = cartSlice;
export const {showMiniCart, hideMiniCart, addToCart, setQuantity, removeFromCart} = actions;
export default reducer;
 