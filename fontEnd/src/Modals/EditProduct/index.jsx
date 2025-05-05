import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { updateProduct } from "~/redux/apiRequest";

const EditProduct = ({ show, onClose, onCreateSuccess, product }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(); // ref cho input file
  const [preview, setPreview] = useState(null);

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
      setImage(null); // Reset ảnh nếu không upload lại
      setPreview(null); // Reset preview
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  }, [product]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product?._id) {
      console.error("Không tìm thấy ID sản phẩm để cập nhật!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    await updateProduct(product._id, formData); // Đảm bảo product._id có giá trị
    onCreateSuccess();
    onClose(); // ← Bạn nên dùng onClose thay vì `show(false)`
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ảnh sản phẩm
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImage}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
            {!image && product?.image && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Ảnh hiện tại:</p>
                <img
                  src={`http://localhost:8000${product.image}`}
                  alt="Ảnh sản phẩm hiện tại"
                  className="w-32 h-32 object-cover rounded border mt-1"
                />
              </div>
            )}
            {preview && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Xem trước ảnh mới:</p>
                <img
                  src={preview}
                  alt="Xem trước"
                  className="w-32 h-32 object-cover rounded border mt-1"
                />
              </div>
            )}
          </div>
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
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
