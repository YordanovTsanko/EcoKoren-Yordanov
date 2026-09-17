import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchAuditLogs = createAsyncThunk(
  "auditLogs/fetchAuditLogs",
  async (
    { entityType, entityId, actor, action, page = 1, limit = 20 } = {},
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosClient.get("/audit-logs", {
        params: { entityType, entityId, actor, action, page, limit },
      });
      return data;
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
  filters: {
    entityType: null,
    entityId: null,
    actor: null,
    action: null,
  },
  status: "idle",
  error: null,
};

const auditLogsSlice = createSlice({
  name: "auditLogs",
  initialState,
  reducers: {
    setAuditLogFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearAuditLogFilters(state) {
      state.filters = initialState.filters;
    },
    clearAuditLogsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.items || action.payload;
        state.total = action.payload.total ?? state.list.length;
        state.page = action.payload.page ?? 1;
        state.limit = action.payload.limit ?? state.limit;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Грешка при зареждане на логовете";
      });
  },
});

export const { setAuditLogFilters, clearAuditLogFilters, clearAuditLogsError } =
  auditLogsSlice.actions;
export default auditLogsSlice.reducer;
