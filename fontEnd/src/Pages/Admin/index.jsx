import React from "react";
import { Link, Outlet } from "react-router-dom";
import Breadcrumb from "~/components/Breadcrumb"; // chỉnh nếu sai path

const Admin = () => {
  return (
    <div className="container mx-auto mt-20 px-4">
      <Breadcrumb />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Link
          to="/admin/manageruser"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded text-center shadow-md transition duration-300">
          Quản lý người dùng
        </Link>
        <Link
          to="/admin/managerproduct"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded text-center shadow-md transition duration-300">
          Quản lý sản phẩm
        </Link>
      </div>

      {/* <div className="bg-white p-4 rounded shadow">
        <Outlet />
      </div> */}
    </div>
  );
};

export default Admin;
