import { Routes, Route } from "react-router-dom";
import React from "react";
import User from "./Pages/Admin/User";
import TrashUser from "./Pages/Admin/User/UserTrash";
import Admin from "./Pages/Admin";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import Profile from "./Pages/Profile";
import Home from "./Pages/Home";
import Product from "./Pages/Admin/Product";
import ProductTrash from "./Pages/Admin/Product/ProductTrash";
import ProductVariant from "./Pages/Admin/ProductVariant";
import ProductVariantTrash from "./Pages/Admin/ProductVariant/ProductVariantTrash";
import Detail from "./Components/Detail";
import "./App.css";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Admin */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/manageruser" element={<User />} />
        <Route path="/admin/trashmanageruser" element={<TrashUser />} />

        {/* User */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* Product */}
        <Route path="/admin/managerproduct" element={<Product />} />
        <Route path="/admin/trashmanagerproduct" element={<ProductTrash />} />
        <Route
          path="/admin/managerproduct/managerproductvariant/:id"
          element={<ProductVariant />}
        />
        <Route
          path="/admin/productvarianttrash/:id"
          element={<ProductVariantTrash />}
        />
        {/* Detail */}
        <Route path="product/:slug" element={<Detail />} />
      </Routes>
      <Footer />
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
