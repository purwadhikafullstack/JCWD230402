import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import adminReducer from "./admin";
import cartReducer from "./cart";

const globalStore = configureStore({
  reducer: {
    authReducer,
    adminReducer,
    cartReducer,
  },
});

export default globalStore;
