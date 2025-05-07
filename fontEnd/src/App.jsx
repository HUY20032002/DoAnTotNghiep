import { Routes, Route } from "react-router-dom";
import React from "react";
import AdminManagerUser from "./Pages/Admin/ManagerUser";
import AdminTrashManagerUser from "./Pages/Admin/ManagerUser/TrashManagerUser";
import Admin from "./Pages/Admin";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import Profile from "./Pages/Profile";
import Home from "./Pages/Home";
import AdminManagerProduct from "./Pages/Admin/ManagerProduct";
import AdminManagerProductTrash from "./Pages/Admin/ManagerProduct/ManagerPtoductTrash";
import "./App.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Header />
      <Home />
      <Footer />
      <ToastContainer />
      <Routes>
        {/* Admin */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/manageruser" element={<AdminManagerUser />} />
        <Route
          path="/admin/trashmanageruser"
          element={<AdminTrashManagerUser />}
        />

        {/* User */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* Product */}
        <Route path="/admin/managerproduct" element={<AdminManagerProduct />} />
        <Route
          path="/admin/trashmanagerproduct"
          element={<AdminManagerProductTrash />}
        />
      </Routes>
    </>
  );
}

export default App;
