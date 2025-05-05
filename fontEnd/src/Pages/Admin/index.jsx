import React from "react";
import { Link, Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <div className="container">
      <Link to="/admin/manageruser">Quản lý người dùng</Link>
      <Link to="/admin/managerproduct">Quản lý sản phẩm</Link>
      {/* <Outlet /> Nơi để hiện AdminManagerUser */}
    </div>
  );
};

export default Admin;
