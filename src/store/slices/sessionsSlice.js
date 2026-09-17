import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchSessions = createAsyncThunk(
  "sessions/fetchSessions",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/sessions");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const deleteSession = createAsyncThunk(
  "sessions/deleteSession",
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/sessions/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const deleteAllSessions = createAsyncThunk(
  "sessions/deleteAllSessions",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.delete("/sessions/all");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  list: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    clearSessionsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Грешка при зареждане на сесиите";
      })

      .addCase(deleteSession.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteSession.rejected, (state, action) => {
        state.error = action.payload?.message || "Грешка при премахване на сесията";
      })

      .addCase(deleteAllSessions.fulfilled, (state) => {
        state.list = [];
      })
      .addCase(deleteAllSessions.rejected, (state, action) => {
        state.error = action.payload?.message || "Грешка при премахване на сесиите";
      });
  },
});

export const { clearSessionsError } = sessionsSlice.actions;
export default sessionsSlice.reducer;
