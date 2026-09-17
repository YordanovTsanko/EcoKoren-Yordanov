import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

// ---- Thunks: текущ потребител ----

export const fetchMe = createAsyncThunk(
  "users/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/users/me");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updateMe = createAsyncThunk(
  "users/updateMe",
  async (payload, { rejectWithValue }) => {
    // payload: { firstName, lastName, username, phone, avatar, bio, preferences, address }
    try {
      const { data } = await axiosClient.patch("/users/me", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const deleteMe = createAsyncThunk(
  "users/deleteMe",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.delete("/users/me");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// ---- Thunks: admin ----

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ role, status, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/users", {
        params: { role, status, page, limit },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get(`/users/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updateUserByAdmin = createAsyncThunk(
  "users/updateUserByAdmin",
  async ({ id, ...payload }, { rejectWithValue }) => {
    // payload: { role, status, firstName, lastName, phone }
    try {
      const { data } = await axiosClient.patch(`/users/${id}`, payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const deleteUserByAdmin = createAsyncThunk(
  "users/deleteUserByAdmin",
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/users/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// ---- Slice ----

const initialState = {
  me: null,
  meStatus: "idle",
  meError: null,

  list: [],
  total: 0,
  page: 1,
  limit: 20,
  listStatus: "idle",
  listError: null,

  selectedUser: null,
  selectedUserStatus: "idle",
  selectedUserError: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSelectedUser(state) {
      state.selectedUser = null;
      state.selectedUserStatus = "idle";
      state.selectedUserError = null;
    },
    clearUsersErrors(state) {
      state.meError = null;
      state.listError = null;
      state.selectedUserError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMe
      .addCase(fetchMe.pending, (state) => {
        state.meStatus = "loading";
        state.meError = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.meStatus = "succeeded";
        state.me = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.meStatus = "failed";
        state.meError = action.payload?.message || "Грешка при зареждане на профила";
      })

      // updateMe
      .addCase(updateMe.pending, (state) => {
        state.meStatus = "loading";
        state.meError = null;
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.meStatus = "succeeded";
        state.me = action.payload;
      })
      .addCase(updateMe.rejected, (state, action) => {
        state.meStatus = "failed";
        state.meError = action.payload?.message || "Грешка при обновяване на профила";
      })

      // deleteMe
      .addCase(deleteMe.fulfilled, (state) => {
        state.me = null;
        state.meStatus = "idle";
      })
      .addCase(deleteMe.rejected, (state, action) => {
        state.meError = action.payload?.message || "Грешка при изтриване на профила";
      })

      // fetchUsers (admin list)
      .addCase(fetchUsers.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        // Очакван формат: { items, total, page, limit } - адаптирай при нужда
        state.list = action.payload.items || action.payload;
        state.total = action.payload.total ?? state.list.length;
        state.page = action.payload.page ?? 1;
        state.limit = action.payload.limit ?? state.limit;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload?.message || "Грешка при зареждане на потребителите";
      })

      // fetchUserById
      .addCase(fetchUserById.pending, (state) => {
        state.selectedUserStatus = "loading";
        state.selectedUserError = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUserStatus = "succeeded";
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.selectedUserStatus = "failed";
        state.selectedUserError = action.payload?.message || "Потребителят не е намерен";
      })

      // updateUserByAdmin
      .addCase(updateUserByAdmin.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((u) => (u.id === updated.id ? updated : u));
        if (state.selectedUser?.id === updated.id) {
          state.selectedUser = updated;
        }
      })
      .addCase(updateUserByAdmin.rejected, (state, action) => {
        state.listError = action.payload?.message || "Грешка при обновяване на потребителя";
      })

      // deleteUserByAdmin
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload);
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUserByAdmin.rejected, (state, action) => {
        state.listError = action.payload?.message || "Грешка при изтриване на потребителя";
      });
  },
});

export const { clearSelectedUser, clearUsersErrors } = usersSlice.actions;
export default usersSlice.reducer;
