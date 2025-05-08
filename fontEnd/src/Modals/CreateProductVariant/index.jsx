import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { createProductVariant } from "~/redux/apiRequest";
import { useDispatch } from "react-redux";

const CreateProductVariant = ({
  show,
  onClose,
  onCreateSuccess,
  productId,
}) => {
  const [productName, setProductName] = useState("");
  const [product_id, setProductId] = useState(productId);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [size, setSize] = useState("");

  const dispatch = useDispatch();

  const token = localStorage.getItem("accessToken"); // Hoặc từ Redux nếu bạn lưu token trong store

  useEffect(() => {
    const fetchProductName = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/product/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProductName(res.data.name);
      } catch (err) {
        console.error("Lỗi khi lấy tên sản phẩm:", err);
      }
    };
    if (productId) setProductId(productId);
    if (productId) fetchProductName();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("product_id", product_id);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("size", size);

      await createProductVariant(dispatch, formData);
      onCreateSuccess();
      onClose();
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
        <h2 className="text-xl font-semibold mb-4">
          Thêm biến thể cho sản phẩm:{" "}
          <span className="text-blue-600">{productName}</span>
          <span className="block text-gray-800 font-semibold">
            ID sản phẩm: {product_id}
          </span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="price"
            placeholder="Giá biến thể"
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded px-3 py-2"
            value={price}
          />
          <div className="flex gap-4">
            {["M", "L", "XL", "XXL"].map((item) => (
              <label key={item} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="size"
                  value={item}
                  checked={size === item} // 👈 so sánh đúng state
                  onChange={(e) => setSize(e.target.value)} // 👈 cập nhật state đúng
                />
                {item}
              </label>
            ))}
          </div>
          <input
            name="stock"
            placeholder="Số lượng của biến thể"
            onChange={(e) => setStock(e.target.value)}
            className="w-full border rounded px-3 py-2"
            value={stock}
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
              Thêm biến thể
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductVariant;
