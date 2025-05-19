import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { updateProduct } from "~/redux/apiRequest";
import { toast } from "react-toastify";

const EditProduct = ({ show, onClose, onCreateSuccess, product }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]); // mảng file ảnh mới
  const [previewImages, setPreviewImages] = useState([]); // mảng URL preview ảnh
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    axios
      .get("http://localhost:8000/categories/all")
      .then((res) => {
        if (Array.isArray(res.data?.data)) {
          setCategories(res.data.data);
        } else {
          console.error("Invalid categories:", res.data);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPrice(product.price || "");
      setStock(product.stock || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setImages([]); // reset ảnh mới
      setPreviewImages([]); // reset preview ảnh mới
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  }, [product]);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    // Kiểm tra kích thước mỗi ảnh
    for (let file of files) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
        return;
      }
    }

    setImages(files);

    // Tạo URL preview
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product?._id) {
      toast.error("Không tìm thấy ID sản phẩm để cập nhật!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("description", description);

    // Gửi từng file ảnh trong mảng images
    images.forEach((file, index) => {
      formData.append("images", file);
    });

    try {
      await updateProduct(product._id, formData);
      toast.success("Cập nhật sản phẩm thành công!");
      onCreateSuccess();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Cập nhật sản phẩm thất bại!");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200 mt-[75px] ${
        show
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      data-id="modal-overlay"
      onClick={(e) => e.target.dataset.id === "modal-overlay" && onClose()}
      role="dialog"
      aria-modal="true">
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-row gap-6 max-h-[80vh] overflow-y-auto">
          {/* Cột bên trái: Hình ảnh */}
          <div className="w-1/3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ảnh sản phẩm (chọn nhiều ảnh)
              </label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleImagesChange}
                className="mt-1 block w-full border rounded px-2 py-1"
              />
              {/* Nếu chưa chọn ảnh mới thì hiển thị ảnh cũ */}
              {images.length === 0 && product?.images?.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {product.images.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:8000${imgUrl}`}
                      alt={`Ảnh sản phẩm ${idx + 1}`}
                      className="w-32 h-32 object-cover rounded border"
                    />
                  ))}
                </div>
              )}

              {/* Hiển thị preview ảnh mới */}
              {previewImages.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {previewImages.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Xem trước ảnh ${idx + 1}`}
                      className="w-32 h-32 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
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
              rows="4"
              placeholder="Mô tả sản phẩm"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
              value={description}
              required
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
                Huỷ
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Sửa sản phẩm
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
