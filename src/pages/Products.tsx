import { useState, useRef, useEffect } from "react";
import { Edit, Trash2, X, Upload } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { SearchForm } from "./_components/search-form";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  clearError,
} from "../store/slices/productSlice";
import { getAllCategories } from "../store/slices/categorySlice";
import { getAllSubCategories } from "../store/slices/subCategorySlice";
import { toast } from "sonner";

export default function Products() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    ProductName: "",
    category: "",
    subCategory: "",
    status: "active",
    image: null as File | null,
    imagePreview: null as string | null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const { products, isLoading, error } = useAppSelector(
    (state: any) =>
      state.products || { products: [], isLoading: false, error: null }
  );
  const { categories } = useAppSelector((state: any) => state.categories);
  const { subcategories } = useAppSelector((state: any) => state.subcategories);

  useEffect(() => {
    dispatch(getAllProducts(undefined));
    dispatch(getAllCategories());
    dispatch(getAllSubCategories({}));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAddProduct = () => {
    setIsEditMode(false);
    setFormData({
      ProductName: "",
      category: "",
      subCategory: "",
      status: "active",
      image: null,
      imagePreview: null,
    });
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setIsEditMode(true);
    setCurrentProduct(product);
    setFormData({
      ProductName: product.ProductName,
      category: product.category?._id || product.category,
      subCategory: product.subCategory?._id || product.subCategory,
      status: product.status,
      image: null,
      imagePreview: product.image,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setCurrentProduct({ _id: productId });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (currentProduct?._id) {
      try {
        await dispatch(deleteProduct(currentProduct._id)).unwrap();
        toast.success("Product deleted successfully!");
      } catch (error) {
        // Error is handled by Redux slice
      }
    }
    setIsDeleteDialogOpen(false);
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("ProductName", formData.ProductName);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("subCategory", formData.subCategory);
    formDataToSend.append("status", formData.status);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (isEditMode && currentProduct) {
        await dispatch(
          updateProduct({ id: currentProduct._id, productData: formDataToSend })
        ).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await dispatch(createProduct(formDataToSend)).unwrap();
        toast.success("Product created successfully!");
      }
      setIsDialogOpen(false);
    } catch (error) {
      // Error is handled by Redux slice
    }
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: null,
    });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Products</h1>

        <div className="flex justify-between items-center gap-2">
          <SearchForm
            className="w-full"
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
          <Button
            className="bg-[#662671] sm:w-auto"
            onClick={handleAddProduct}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Add Product"}
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Loading products...</div>
          </div>
        )}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-25">ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead className="hidden md:table-cell">
                  Sub Category
                </TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Image</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right w-17.5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    No products found. Add your first product to get started.
                  </TableCell>
                </TableRow>
              ) : (
                products
                  .filter((product: any) =>
                    product.ProductName.toLowerCase().includes(
                      searchTerm.toLowerCase()
                    )
                  )
                  .map((product: any) => (
                    <TableRow key={product._id}>
                      <TableCell className="font-medium text-sm">
                        {product._id}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{product.ProductName}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {product.subCategory?.subCategoryName || "N/A"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {product.category?.categoryName || "N/A"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {product.image && (
                          <img
                            // src={`http://localhost:5000/uploads/${product.image}`}
                            src={product.image}
                            alt={product.ProductName}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <button
                            className="text-blue-600 mr-2"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-600"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Edit product details below."
                : "Create a new product by filling in details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="ProductName">Product Name</Label>
              <Input
                id="ProductName"
                value={formData.ProductName}
                onChange={(e) =>
                  setFormData({ ...formData, ProductName: e.target.value })
                }
                placeholder="Enter product name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category: any) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subCategory">Subcategory</Label>
              <Select
                value={formData.subCategory}
                onValueChange={(value) =>
                  setFormData({ ...formData, subCategory: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories?.map((subcategory: any) => (
                    <SelectItem key={subcategory._id} value={subcategory._id}>
                      {subcategory.subCategoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={formData.status === "active"}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      status: checked ? "active" : "inactive",
                    })
                  }
                />
                <Label htmlFor="status" className="text-sm font-medium">
                  {formData.status === "active" ? "Active" : "Inactive"}
                </Label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Product Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {formData.imagePreview ? (
                  <div className="relative">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`text-center p-8 border-2 border-dashed rounded-lg ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        Drag and drop an image here, or click to select
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Select Image
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Saving..." : isEditMode ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
