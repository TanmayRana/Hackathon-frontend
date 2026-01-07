import { useState, useRef, useEffect } from "react";
import { PlusCircle, Search, Edit, Trash2, X, Upload } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
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
  DialogTrigger,
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
  getAllSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  clearError,
} from "../store/slices/subCategorySlice";
import { getAllCategories } from "../store/slices/categorySlice";
import { toast } from "sonner";

interface Subcategory {
  id: string;
  name: string;
  categoryName: string;
  status: string;
  image: string;
}

export default function Subcategory() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    subCategoryName: "",
    categoryId: "",
    status: "active",
    image: null as File | null,
    imagePreview: undefined as string | undefined,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const { subcategories, isLoading, error } = useAppSelector(
    (state: any) => state.subcategories
  );
  const { categories } = useAppSelector((state: any) => state.categories);

  console.log(subcategories);


  useEffect(() => {
    dispatch(getAllSubCategories({}));
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAddSubcategory = () => {
    setIsEditMode(false);
    setFormData({
      subCategoryName: "",
      categoryId: "",
      status: "active",
      image: null,
      imagePreview: undefined,
    });
    setIsDialogOpen(true);
  };

  const handleEditSubcategory = (subcategory: any) => {
    setIsEditMode(true);
    setCurrentSubcategory(subcategory);
    setFormData({
      subCategoryName: subcategory.subCategoryName,
      categoryId: subcategory.categoryId?._id || subcategory.categoryId,
      status: subcategory.status,
      image: null,
      imagePreview: subcategory.imageUrl,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteSubcategory = (subcategoryId: string) => {
    setCurrentSubcategory({ _id: subcategoryId });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (currentSubcategory?._id) {
      try {
        await dispatch(deleteSubCategory(currentSubcategory._id)).unwrap();
        toast.success("Subcategory deleted successfully!");
      } catch (error) {
        // Error is handled by Redux slice
      }
    }
    setIsDeleteDialogOpen(false);
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("subCategoryName", formData.subCategoryName);
    formDataToSend.append("categoryId", formData.categoryId);
    formDataToSend.append("status", formData.status);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (isEditMode && currentSubcategory) {
        await dispatch(
          updateSubCategory({
            id: currentSubcategory._id,
            subcategoryData: formDataToSend,
          })
        ).unwrap();
        toast.success("Subcategory updated successfully!");
      } else {
        await dispatch(createSubCategory(formDataToSend)).unwrap();
        toast.success("Subcategory created successfully!");
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
      imagePreview: undefined,
    });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Subcategory</h1>

        <div className="flex justify-between items-center gap-2">
          <SearchForm
            className="w-full"
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
          <Button
            className="bg-[#662671] sm:w-auto"
            onClick={handleAddSubcategory}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Add Subcategory"}
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Loading subcategories...</div>
          </div>
        )}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-25">ID</TableHead>
                <TableHead>Sub Category Name</TableHead>
                <TableHead className="hidden md:table-cell">
                  Category Name
                </TableHead>
                <TableHead className="hidden md:table-cell">Image</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right w-17.5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!subcategories || subcategories.length === 0) && !isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No subcategories found. Add your first subcategory to get
                    started.
                  </TableCell>
                </TableRow>
              ) : (
                subcategories
                  ?.filter(
                    (subcategory: any) =>
                      subcategory.subCategoryName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      subcategory.categoryId?.categoryName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((subcategory: any) => (
                    <TableRow key={subcategory._id}>
                      <TableCell className="font-medium text-sm">
                        {subcategory._id}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {subcategory.subCategoryName}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {subcategory.categoryId?.categoryName || "N/A"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {subcategory.imageUrl && (
                          <img
                            src={subcategory.imageUrl}
                            alt={subcategory.subCategoryName}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            subcategory.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            subcategory.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {subcategory.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <button
                            className="text-blue-600 mr-2"
                            onClick={() => handleEditSubcategory(subcategory)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-600"
                            onClick={() =>
                              handleDeleteSubcategory(subcategory._id)
                            }
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

      {/* Add/Edit Subcategory Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Subcategory" : "Add Subcategory"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Edit subcategory details below."
                : "Create a new subcategory by filling in details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subCategoryName">Subcategory Name</Label>
              <Input
                id="subCategoryName"
                value={formData.subCategoryName}
                onChange={(e) =>
                  setFormData({ ...formData, subCategoryName: e.target.value })
                }
                placeholder="Enter subcategory name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.categoryName}
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
              <Label>Subcategory Image</Label>
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
            <AlertDialogTitle>Delete Subcategory</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this subcategory? This action
              cannot be undone.
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
