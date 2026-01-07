import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";

import categorySlice from "./slices/categorySlice";
import subCategorySlice from "./slices/subCategorySlice";
import productSlice from "./slices/productSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    categories: categorySlice,
    subcategories: subCategorySlice,
    products: productSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
