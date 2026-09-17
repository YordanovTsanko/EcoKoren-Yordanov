import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async ({ read, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/notifications", {
        params: { read, page, limit },
      });
      return data;
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
      return data;
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
      return id;
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
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.items || action.payload;
        state.total = action.payload.total ?? state.list.length;
        state.page = action.payload.page ?? 1;
        state.limit = action.payload.limit ?? state.limit;
        state.unreadCount = state.list.filter((n) => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Грешка при зареждане на известията";
      })

      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((n) => (n.id === updated.id ? updated : n));
        state.unreadCount = state.list.filter((n) => !n.read).length;
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.error = action.payload?.message || "Грешка при отбелязване като прочетено";
      })

      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.list = state.list.map((n) => ({ ...n, read: true }));
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.error = action.payload?.message || "Грешка при отбелязване на всички";
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.list = state.list.filter((n) => n.id !== action.payload);
        state.unreadCount = state.list.filter((n) => !n.read).length;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload?.message || "Грешка при изтриване на известието";
      });
  },
});

export const { clearNotificationsError } = notificationsSlice.actions;
export default notificationsSlice.reducer;
