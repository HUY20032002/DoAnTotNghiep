import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createProduct, Categories } from "~/redux/apiRequest";

const CreateProduct = ({ show, onClose, onCreateSuccess }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]);

  const fileInputRef = useRef();
  const dispatch = useDispatch();

  // Fetch categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catData = await Categories();
        if (catData?.data && Array.isArray(catData.data)) {
          setCategories(catData.data);
        } else {
          console.error("Invalid categories format:", catData);
        }
      } catch (error) {
        console.error("Fetch data error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (show) resetForm();
  }, [show]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setDescription("");
    setCategory("");
    setImages([]);
    setImagePreviews([]);

    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  // Handle file change
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    const oversized = files.find((file) => file.size > 2 * 1024 * 1024);
    if (oversized) {
      toast.error("Một trong các ảnh vượt quá 2MB.");
      return;
    }

    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh sản phẩm!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("description", description);
    images.forEach((file) => formData.append("images", file)); // gửi nhiều ảnh

    try {
      await createProduct(dispatch, formData);
      onCreateSuccess();
      onClose();
      resetForm(); // <-- Thêm dòng này
      toast.success("Thêm sản phẩm thành công");
    } catch (err) {
      toast.error("Thêm sản phẩm thất bại");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200 mt-[64px] ${
        show
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      data-id="modal-overlay"
      onClick={(e) => e.target.dataset.id === "modal-overlay" && onClose()}
      role="dialog"
      aria-modal="true">
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-row gap-6 max-h-[80vh] overflow-y-auto">
          {/* Cột bên trái: Hình ảnh */}
          <div className="w-1/3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ảnh sản phẩm (nhiều ảnh)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="mt-1 block w-full border rounded px-2 py-1"
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                {imagePreviews.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`preview-${index}`}
                    className="w-full h-28 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Cột bên phải: Thông tin sản phẩm */}
          <div className="w-2/3 space-y-4">
            <input
              name="name"
              placeholder="Tên sản phẩm"
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              value={name}
              required
            />
            <input
              name="price"
              type="number"
              placeholder="Giá"
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded px-3 py-2"
              value={price}
              required
            />
            <input
              name="stock"
              type="number"
              placeholder="Số lượng"
              onChange={(e) => setStock(e.target.value)}
              className="w-full border rounded px-3 py-2"
              value={stock}
              required
            />
            <select
              name="category"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full border rounded px-3 py-2"
              required>
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <textarea
              name="description"
              rows="3"
              placeholder="Mô tả sản phẩm"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
              value={description}
              required
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
                Huỷ
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Thêm sản phẩm
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateProduct;
