import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import productsReducer from "./slices/productsSlice";
import searchReducer from "./slices/searchSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    search: searchReducer,
  },
});
