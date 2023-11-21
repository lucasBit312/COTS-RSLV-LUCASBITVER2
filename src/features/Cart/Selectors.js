import { createSelector } from "@reduxjs/toolkit";

const cartItemsSelector = (state) => state.cart.cartItems;
console.log("cartItemsSelector", cartItemsSelector)
export const cartItemsCountSelector = createSelector(
    cartItemsSelector, (cartItems) =>
    cartItems.reduce((count, item) => count + item.quantity,0)
);

export const cartTotalSelector = createSelector(
    cartItemsSelector, (cartItems) =>
    cartItems.reduce((total, item) => total + item.food?.id * item.quantity,0)
);