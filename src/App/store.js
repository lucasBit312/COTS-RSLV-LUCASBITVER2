import { configureStore } from '@reduxjs/toolkit'; // Correct the import statement
import useReducer  from '../features/Auth/userSlide';
import cartReducer from '../features/Cart/CartSlide';
const rootReducer = {
  user: useReducer,
  cart: cartReducer
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
