import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import adminReducer from './admin'


const globalStore = configureStore({
    reducer: {
        authReducer,
        adminReducer,
    },
});

export default globalStore;