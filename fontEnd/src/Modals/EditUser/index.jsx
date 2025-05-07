import React, { useState, useEffect } from "react";

function EditUser({ show, onClose, onSave, user }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  if (!show) return null;

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  const handleSave = () => {
    const userUpdate = {
      name,
      email,
      phone,
      address,
    };
    onSave(userUpdate);
    onClose();
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm mt-[64px]">
      <div
        className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Chỉnh Sửa Người Dùng</h2>
          <button
            className="text-gray-500 hover:text-red-500 text-xl font-bold"
            onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Tên"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
          <input
            type="text"
            placeholder="Điện thoại"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Địa chỉ"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
