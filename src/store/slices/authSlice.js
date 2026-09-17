import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

// ---- Thunks ----

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password, firstName, lastName }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/auth/register", {
        email,
        password,
        firstName,
        lastName,
      });
      return data;
    } catch (err) {
      console.log("err.response?.data", err.response?.data);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/auth/login", {
        email,
        password,
      });
      if (data.accessToken)
        localStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken)
        localStorage.setItem("refreshToken", data.refreshToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

export const refreshTokens = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const { data } = await axiosClient.post("/auth/refresh", {
        refreshToken,
      });
      if (data.accessToken)
        localStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken)
        localStorage.setItem("refreshToken", data.refreshToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await axiosClient.post("/auth/logout", { refreshToken });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return true;
    } catch (err) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get(`/auth/verify-email/${token}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/auth/forgot-password", {
        email,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post(`/auth/reset-password/${token}`, {
        password,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ---- Slice ----

const initialState = {
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  message: null, // за forgot-password / verify-email съобщения
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    clearAuthMessage(state) {
      state.message = null;
    },
    // За случаите когато токенът е изтрит извън auth flow (напр. от interceptor)
    forceLogout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = "Регистрацията е успешна. Провери имейла си.";
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Грешка при регистрация";
      })

      // login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user || null;
        state.accessToken = action.payload.accessToken || null;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Грешен имейл или парола";
      })

      // refresh
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken || state.accessToken;
        state.refreshToken = action.payload.refreshToken || state.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(refreshTokens.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.status = "idle";
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })

      // verify email
      .addCase(verifyEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.status = "succeeded";
        state.message = "Имейлът е потвърден успешно.";
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Невалиден или изтекъл линк";
      })

      // forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = "succeeded";
        state.message = "Изпратихме линк за възстановяване на паролата.";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Грешка при заявката";
      })

      // reset password
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = "succeeded";
        state.message = "Паролата е сменена успешно.";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Невалиден или изтекъл линк";
      })

      // change password
      .addCase(changePassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = "succeeded";
        state.message = "Паролата е обновена успешно.";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Грешна текуща парола";
      });
  },
});

export const { clearAuthError, clearAuthMessage, forceLogout } =
  authSlice.actions;
export default authSlice.reducer;
