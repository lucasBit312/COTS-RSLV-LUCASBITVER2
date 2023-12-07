import { configureStore } from '@reduxjs/toolkit'; // Correct the import statement
import useReducer from '../features/Auth/userSlide';
import cartReducer from '../features/Cart/CartSlide';
import noticeReducer from '../features/Notice/NoticeSlide';
const rootReducer = {
  user: useReducer,
  cart: cartReducer,
  notice: noticeReducer
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
