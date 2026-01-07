import { Button } from "../components/ui/button";
import { SearchForm } from "./_components/search-form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { MoreHorizontal, Edit, Trash2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError,
} from "../store/slices/categorySlice";
import { toast } from "sonner";

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

export default function Category() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: "",
    status: "active",
    image: null as File | null,
    imagePreview: null as string | null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const { categories, isLoading, error } = useAppSelector((state: any) => {
    return (
      state.categories || { categories: [], isLoading: false, error: null }
    );


  });

  console.log(categories);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAddCategory = () => {
    setIsEditMode(false);
    setFormData({
      categoryName: "",
      status: "active",
      image: null,
      imagePreview: null,
    });
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: any) => {
    setIsEditMode(true);
    setCurrentCategory(category);
    setFormData({
      categoryName: category.categoryName,
      status: category.status,
      image: null,
      imagePreview: category.imageUrl,
    });
    setIsDialogOpen(true);
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

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("categoryName", formData.categoryName);
    formDataToSend.append("status", formData.status);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (isEditMode && currentCategory) {
        await dispatch(
          updateCategory({
            id: currentCategory._id,
            categoryData: formDataToSend,
          })
        ).unwrap();
        toast.success("Category updated successfully!");
      } else {
        await dispatch(createCategory(formDataToSend)).unwrap();
        toast.success("Category created successfully!");
      }
      setIsDialogOpen(false);
    } catch (error) {
      // Error is handled by Redux slice
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: null,
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCurrentCategory({ _id: categoryId });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (currentCategory?._id) {
      try {
        await dispatch(deleteCategory(currentCategory._id)).unwrap();
        toast.success("Category deleted successfully!");
      } catch (error) {
        // Error is handled by Redux slice
      }
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between  gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center">Category</h1>

        <div className="flex justify-between items-center gap-2">
          <div className="">
            {/* <input type="text" placeholder="Search" className="w-full" /> */}
            <SearchForm
              className="w-full"
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            className="bg-[#662671]  sm:w-auto"
            onClick={handleAddCategory}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Add Category"}
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Loading categories...</div>
          </div>
        )}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-25">ID</TableHead>
                <TableHead>Category name</TableHead>
                <TableHead className="hidden md:table-cell">Image</TableHead>
                <TableHead>Status</TableHead>

                <TableHead className="text-right w-17.5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No categories found. Add your first category to get started.
                  </TableCell>
                </TableRow>
              ) : (
                categories
                  .filter((category: any) =>
                    category.categoryName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((category: any) => (
                    <TableRow key={category._id}>
                      <TableCell className="font-medium text-sm">
                        {category._id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{category.categoryName}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {category.imageUrl && (
                          <img
                            // src={`http://localhost:5000/uploads/${category.image}`}
                            src={category.imageUrl}
                            alt={category.categoryName}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            category.status === "active" ? "default" : "secondary"
                          }
                          className={
                            category.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {category.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <button
                            className="text-blue-600 mr-2"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-600"
                            onClick={() => handleDeleteCategory(category._id)}
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

      {/* Add/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Edit the category details below."
                : "Create a new category by filling in the details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.categoryName}
                onChange={(e) =>
                  setFormData({ ...formData, categoryName: e.target.value })
                }
                placeholder="Enter category name"
              />
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
              <Label>Category Image</Label>
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
                    className={`text-center p-8 border-2 border-dashed rounded-lg ${isDragging
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#662671]" onClick={handleSubmit}>
              {isEditMode ? "Update" : "Save"} Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot
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
