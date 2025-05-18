import { useState } from "react";
import { registerUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import Breadcrumb from "~/components/Breadcrumb"; // chỉnh nếu sai path
function Wishlist() {
  return (
    <div className="container mx-auto p-4 mt-[64px]">
      <Breadcrumb />
      <div className="">WishList</div>
    </div>
  );
}

export default Wishlist;
