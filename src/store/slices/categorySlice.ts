import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
};


export const getAllCategories = createAsyncThunk(
  "categories/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/categories");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const getCategoryById = createAsyncThunk(
  "categories/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch category"
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (categoryData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post("/categories", categoryData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create category"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async (
    { id, categoryData }: { id: string; categoryData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update category"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/categories/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getAllCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories || action.payload;
        state.error = null;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(getCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload.category;
        state.error = null;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.push(action.payload.category);
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categories.findIndex(
          (cat) => cat._id === action.payload.category._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload.category;
        }
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;
