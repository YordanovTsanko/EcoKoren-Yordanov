import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

function buildProductFormData(fields, images) {
  const formData = new FormData();
  if (fields.name !== undefined) formData.append("name", fields.name);
  if (fields.description !== undefined)
    formData.append("description", fields.description);
  if (fields.type !== undefined) formData.append("type", fields.type);
  if (fields.quantityType !== undefined)
    formData.append("quantityType", fields.quantityType);
  if (fields.quantity !== undefined)
    formData.append("quantity", fields.quantity);
  if (fields.price !== undefined) formData.append("price", fields.price);
  if (fields.isActive !== undefined)
    formData.append("isActive", fields.isActive);
  if (fields.features !== undefined)
    formData.append("features", JSON.stringify(fields.features));
  if (images && images.length > 0) {
    images.forEach((file) => {
      formData.append("images", file); 
    });
  } 
  return formData;
}

function extractErrorMessage(err, fallback) {
  return err.response?.data?.message || err.message || fallback;
}

// ------------------------------------------------------------- thunks ----

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (overrideParams = {}, { getState, rejectWithValue }) => {
    try {
      const { filters, pagination } = getState().products;
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort: filters.sort,
        order: filters.order,
        ...(filters.type && { type: filters.type }),
        ...(filters.quantityType && { quantityType: filters.quantityType }),
        ...(filters.minPrice !== "" &&
          filters.minPrice != null && { minPrice: filters.minPrice }),
        ...(filters.maxPrice !== "" &&
          filters.maxPrice != null && { maxPrice: filters.maxPrice }),
        ...(filters.search && { search: filters.search }),
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
        ...overrideParams,
      };
      const { data } = await axiosClient.get("/products", { params });
      return data.data; // { items, pagination }
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Грешка при зареждане на продуктите."),
      );
    }
  },
);

export const fetchProductById = createAsyncThunk(
  "products/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get(`/products/${id}`);
      return data.data.product;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Продуктът не е намерен."),
      );
    }
  },
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async ({ fields, imageFiles = [] }, thunkAPI) => {
    try {
      const formData = buildProductFormData(fields, imageFiles);
      
      const response = await axiosClient.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      return response.data.data.product;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        extractErrorMessage(
          error,
          "Възникна грешка при създаването на продукта.",
        ),
      );
    }
  },
);


export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, fields, imageFiles } = {}, { rejectWithValue }) => {
    try {
      const hasFiles = imageFiles && imageFiles.length > 0;
      const payload = hasFiles
        ? buildProductFormData(fields, imageFiles)
        : fields;
      const { data } = await axiosClient.patch(`/products/${id}`, payload);
      return data.data.product;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Грешка при обновяване на продукт."),
      );
    }
  },
);

// Backend soft-delete: маркира isActive:false, не трие записа.
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.delete(`/products/${id}`);
      return data.data.product;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Грешка при изтриване на продукт."),
      );
    }
  },
);

export const restoreProduct = createAsyncThunk(
  "products/restore",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.patch(`/products/${id}/restore`);
      return data.data.product;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Грешка при възстановяване на продукт."),
      );
    }
  },
);

// -------------------------------------------------------------- slice ----

const initialFilters = {
  type: "",
  quantityType: "", // 'kg' | 'l' | 'piece'
  minPrice: "",
  maxPrice: "",
  search: "",
  isActive: true, // true | false — умишлено без "всички", виж бележка №5 горе
  sort: "createdAt", // 'createdAt' | 'updatedAt' | 'name' | 'price' | 'quantity'
  order: "desc", // 'asc' | 'desc'
};

const initialState = {
  items: [],
  pagination: { page: 1, limit: 20, total: 0, pages: 1 },
  filters: initialFilters,
  status: "idle", // idle | loading | succeeded | failed
  error: null,

  selected: null,
  selectedStatus: "idle",
  selectedError: null,

  mutationStatus: "idle", // за create/update/delete/restore спинъри
  mutationError: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProductFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    resetProductFilters(state) {
      state.filters = initialFilters;
      state.pagination.page = 1;
    },
    setProductsPage(state, action) {
      state.pagination.page = action.payload;
    },
    setProductsLimit(state, action) {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
    clearSelectedProduct(state) {
      state.selected = null;
      state.selectedStatus = "idle";
      state.selectedError = null;
    },
    clearProductMutationError(state) {
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.selectedStatus = "loading";
        state.selectedError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.selectedError = action.payload;
      })

      // createProduct
      .addCase(createProduct.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.items.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })

      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selected?._id === action.payload._id)
          state.selected = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })

      // deleteProduct (soft delete → isActive:false)
      .addCase(deleteProduct.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        // Ако текущият изглед показва активни продукти, деактивираният
        // вече не отговаря на филтъра — маха се от списъка. Ако изгледът
        // вече е върху неактивни, просто обновяваме реда му.
        if (state.filters.isActive !== false) {
          state.items = state.items.filter((p) => p._id !== action.payload._id);
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        } else {
          const idx = state.items.findIndex(
            (p) => p._id === action.payload._id,
          );
          if (idx !== -1) state.items[idx] = action.payload;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })

      // restoreProduct (isActive:true)
      .addCase(restoreProduct.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(restoreProduct.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        if (state.filters.isActive === false) {
          state.items = state.items.filter((p) => p._id !== action.payload._id);
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        } else {
          const idx = state.items.findIndex(
            (p) => p._id === action.payload._id,
          );
          if (idx !== -1) state.items[idx] = action.payload;
        }
      })
      .addCase(restoreProduct.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      });
  },
});

export const {
  setProductFilters,
  resetProductFilters,
  setProductsPage,
  setProductsLimit,
  clearSelectedProduct,
  clearProductMutationError,
} = productsSlice.actions;

export default productsSlice.reducer;
