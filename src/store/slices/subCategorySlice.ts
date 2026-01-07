import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

interface SubCategory {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface SubCategoryState {
  subcategories: SubCategory[];
  currentSubCategory: SubCategory | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SubCategoryState = {
  subcategories: [],
  currentSubCategory: null,
  isLoading: false,
  error: null,
};


export const getAllSubCategories = createAsyncThunk(
  "subcategories/getAll",
  async ({ categoryId }: { categoryId?: string } = {}, { rejectWithValue }) => {
    try {
      const url = categoryId
        ? `/subcategories?categoryId=${categoryId}`
        : "/subcategories";
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subcategories"
      );
    }
  }
);

export const getSubCategoryById = createAsyncThunk(
  "subcategories/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subcategories/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subcategory"
      );
    }
  }
);

export const createSubCategory = createAsyncThunk(
  "subcategories/create",
  async (subcategoryData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post("/subcategories", subcategoryData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create subcategory"
      );
    }
  }
);

export const updateSubCategory = createAsyncThunk(
  "subcategories/update",
  async (
    { id, subcategoryData }: { id: string; subcategoryData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/subcategories/${id}`, subcategoryData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update subcategory"
      );
    }
  }
);

export const deleteSubCategory = createAsyncThunk(
  "subcategories/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/subcategories/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete subcategory"
      );
    }
  }
);

const subCategorySlice = createSlice({
  name: "subcategories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSubCategory: (state) => {
      state.currentSubCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getAllSubCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllSubCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subcategories = action.payload.subCategories || [];
        state.error = null;
      })
      .addCase(getAllSubCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(getSubCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSubCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSubCategory = action.payload.subCategory;
        state.error = null;
      })
      .addCase(getSubCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(createSubCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subcategories.push(action.payload.subCategory);
        state.error = null;
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateSubCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.subcategories.findIndex(
          (sub) => sub._id === action.payload.subCategory._id
        );
        if (index !== -1) {
          state.subcategories[index] = action.payload.subCategory;
        }
        state.error = null;
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteSubCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subcategories = state.subcategories.filter(
          (sub) => sub._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentSubCategory } = subCategorySlice.actions;
export default subCategorySlice.reducer;
