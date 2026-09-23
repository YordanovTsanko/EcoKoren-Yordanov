import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async ({ read, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/notifications", {
        params: { read, page, limit },
      });
      return data; // Бекендът връща: { status, results, unreadCount, data: { notifications } }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.patch(`/notifications/${id}/read`);
      return data; // Бекендът връща: { status, data: { notification } }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllNotificationsRead",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.patch("/notifications/read-all");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/notifications/${id}`);
      return id; // Връщаме изтритото ID, за да го махнем от списъка в UI
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  list: [],
  total: 0,
  page: 1,
  limit: 20,
  unreadCount: 0,
  status: "idle",
  error: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotificationsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH NOTIFICATIONS
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Масива вече се взема точно от data.notifications на Express контролера ти
        state.list = action.payload?.data?.notifications || [];
        // Вземаме unreadCount директно изчислен от агрегацията на бекенда ти
        state.unreadCount = action.payload?.unreadCount || 0;
        state.total = action.payload?.results || state.list.length;
        state.page = action.payload?.page ?? 1;
        state.limit = action.payload?.limit ?? state.limit;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Грешка при зареждане на известията";
      })

      // MARK SINGLE AS READ
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        // Напасване спрямо твоя Express отговор: data.notification
        const updatedNotification = action.payload?.data?.notification;
        if (updatedNotification) {
          state.list = state.list.map((n) =>
            n._id === updatedNotification._id ? updatedNotification : n
          );
        }
        state.unreadCount = state.list.filter((n) => !n.read).length;
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.error = action.payload?.message || "Грешка при отбелязване като прочетено";
      })

      // MARK ALL AS READ
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.list = state.list.map((n) => ({ ...n, read: true }));
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.error = action.payload?.message || "Грешка при отбелязване на всички";
      })

      // DELETE NOTIFICATION
      .addCase(deleteNotification.fulfilled, (state, action) => {
        // Използваме _id за филтриране, тъй като работим с MongoDB модели
        state.list = state.list.filter((n) => n._id !== action.payload);
        state.unreadCount = state.list.filter((n) => !n.read).length;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload?.message || "Грешка при изтриване на известието";
      });
  },
});

export const { clearNotificationsError } = notificationsSlice.actions;
export default notificationsSlice.reducer;
