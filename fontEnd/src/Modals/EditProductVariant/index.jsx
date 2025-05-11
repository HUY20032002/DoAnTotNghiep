import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { updateProductVariant } from "~/redux/apiRequest";
import { useDispatch } from "react-redux";

const EditProductVariant = ({
  show,
  onClose,
  onCreateSuccess,
  productId,
  productVariant,
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
  useEffect(() => {
    if (productVariant) {
      setPrice(productVariant.price || "");
      setStock(productVariant.stock || "");
      setSize(productVariant.size || "");
    }
  }, [productVariant]); // Chỉ chạy khi `productVariant` thay đổi

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!price || !stock || !size) {
      toast.error("Vui lòng điền đầy đủ thông tin (Giá, Số lượng, Size).");
      return;
    }

    try {
      const data = {
        product_id,
        price,
        stock,
        size,
      };

      const result = await updateProductVariant(
        dispatch,
        data,
        productVariant._id
      );
      if (result.success) {
        toast.success("Sửa sản phẩm thành công");
        onCreateSuccess();
        onClose();
      } else {
        toast.error(result.error || "Sửa sản phẩm thất bại");
      }
    } catch (err) {
      toast.error("Đã xảy ra lỗi khi sửa sản phẩm");
      console.error(err);
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
              Sửa biến thể
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductVariant;
