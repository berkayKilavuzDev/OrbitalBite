import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import orderReducer from "./orderSlice"; // ✅ Yeni ekleme

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    order: orderReducer, // ✅ Yeni ekleme
  },
});

export default store;
