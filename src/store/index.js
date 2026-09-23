import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import productsReducer from "./slices/productsSlice";
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/usersSlice";
import sessionsReducer from "./slices/sessionsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import auditLogsReducer from "./slices/auditLogsSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,

    auth: authReducer,
    users: usersReducer,
    sessions: sessionsReducer,
    notifications: notificationsReducer,
    auditLogs: auditLogsReducer,
  },
});