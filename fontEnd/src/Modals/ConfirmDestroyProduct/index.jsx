import React from "react";

function ConfirmDestroyProduct({ show, onClose, onConfirm, product }) {
  if (!show) return null;

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div
        className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg"
        onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Bạn muốn xóa vĩnh viễn sản phẩm này?
        </h2>
        <p className="mb-4 text-gray-700 text-center">
          Sản Phẩm: <strong>{product.name}</strong>
        </p>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Xóa Vĩnh Viễn
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDestroyProduct;
