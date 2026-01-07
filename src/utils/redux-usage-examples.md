# Redux Integration Usage Examples

This document shows how to use the Redux setup for backend API integration.

## Backend Routes Available

### Auth Routes (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (protected)

### Category Routes (`/api/categories`)

- `GET /` - Get all categories
- `GET /:id` - Get category by ID
- `POST /` - Create category (protected, with image upload)
- `PUT /:id` - Update category (protected, with image upload)
- `DELETE /:id` - Delete category (protected)

### SubCategory Routes (`/api/subcategories`)

- `GET /` - Get all subcategories (optional ?categoryId filter)
- `GET /:id` - Get subcategory by ID
- `POST /` - Create subcategory (protected, with image upload)
- `PUT /:id` - Update subcategory (protected, with image upload)
- `DELETE /:id` - Delete subcategory (protected)

### Product Routes (`/api/products`)

- `GET /` - Get all products
- `GET /:id` - Get product by ID
- `POST /` - Create product (protected, with image upload)
- `PUT /:id` - Update product (protected, with image upload)
- `DELETE /:id` - Delete product (protected)

## Redux Usage Examples

### 1. SubCategory Page Example

```typescript
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  getAllSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../store/slices/subCategorySlice";

export default function Subcategory() {
  const dispatch = useAppDispatch();
  const { subcategories, isLoading, error } = useAppSelector(
    (state) => state.subcategories
  );

  useEffect(() => {
    dispatch(getAllSubCategories());
  }, [dispatch]);

  const handleCreate = (formData: FormData) => {
    dispatch(createSubCategory(formData));
  };

  const handleUpdate = (id: string, formData: FormData) => {
    dispatch(updateSubCategory({ id, subcategoryData: formData }));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteSubCategory(id));
  };

  // Filter by categoryId if needed
  const handleFilterByCategory = (categoryId: string) => {
    dispatch(getAllSubCategories({ categoryId }));
  };

  return (
    // Your JSX here
    <div>
      {subcategories.map((sub) => (
        <div key={sub._id}>
          <h3>{sub.name}</h3>
          <button onClick={() => handleDelete(sub._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### 2. Products Page Example

```typescript
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../store/slices/productSlice";

export default function Products() {
  const dispatch = useAppDispatch();
  const { products, isLoading, error } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const handleCreate = (formData: FormData) => {
    // FormData should include: name, description, price, image, categoryId, subcategoryId
    dispatch(createProduct(formData));
  };

  const handleUpdate = (id: string, formData: FormData) => {
    dispatch(updateProduct({ id, productData: formData }));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteProduct(id));
  };

  return (
    // Your JSX here
    <div>
      {products.map((product) => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
          <button onClick={() => handleDelete(product._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### 3. Form Data Handling for Image Upload

```typescript
const handleSubmit = (isEdit: boolean, currentId?: string) => {
  const formData = new FormData();

  // Text fields
  formData.append("name", name);
  formData.append("description", description);
  formData.append("status", status);

  // For products
  if (price) formData.append("price", price.toString());
  if (categoryId) formData.append("categoryId", categoryId);
  if (subcategoryId) formData.append("subcategoryId", subcategoryId);

  // Image file (if selected)
  if (imageFile) {
    formData.append("image", imageFile);
  }

  if (isEdit && currentId) {
    dispatch(updateCategory({ id: currentId, categoryData: formData }));
  } else {
    dispatch(createCategory(formData));
  }
};
```

### 4. Error Handling

```typescript
useEffect(() => {
  if (error) {
    // Show error notification
    toast.error(error);
    // Clear error after 3 seconds
    setTimeout(() => {
      dispatch(clearError());
    }, 3000);
  }
}, [error, dispatch]);
```

### 5. Loading States

```typescript
return (
  <div>
    {isLoading && <div>Loading...</div>}

    {/* Your content */}

    <button onClick={handleAction} disabled={isLoading}>
      {isLoading ? "Processing..." : "Submit"}
    </button>
  </div>
);
```

## API Base Configuration

The API is configured to connect to `http://localhost:5000/api` by default.
Authentication tokens are automatically added to requests and handled in responses.

## Image Upload

Images are uploaded as FormData and should be handled with the following structure:

- Use `FormData` for multipart/form-data requests
- Images are stored in `/uploads` directory on the backend
- Image URLs should be prefixed with `http://localhost:5000/uploads/` in the frontend

## Authentication Flow

1. Login/Register stores token in localStorage
2. Token is automatically included in all protected requests
3. 401 responses automatically clear token and redirect to login
4. User state is managed in Redux auth slice
