import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Breadcrumb from "~/components/Breadcrumb";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "~/redux/cartSlice";

function Cart() {
  // redux cart
  const carts = useSelector((state) => state.cart?.items || []);
  // redux user
  const user = useSelector((state) => state.auth.login.currentUser);

  useEffect(() => {
    console.log(user);
  }, [user]); // chỉ log khi user thay đổi

  const dispatch = useDispatch();

  const handleDeleteCart = (id) => {
    console.log("deletecart");
    dispatch(removeFromCart(id));
  };
  const handlePushStock = (id) => {
    dispatch(increaseQuantity(id));
  };

  const handleMinusStock = (id) => {
    dispatch(decreaseQuantity(id));
  };
  const handlePay = () => {
    console.log("Thanh toán thành công");
  };
  return (
    <div className="container mx-auto p-4 mt-[64px]">
      <Breadcrumb />
      <h3 className="text-xl font-semibold mb-4">Giỏ hàng</h3>

      {carts.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Giỏ hàng bên trái */}
          <div className="flex-1 space-y-6">
            {carts.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-white p-4 rounded shadow">
                <button
                  className=" text-lg "
                  onClick={() => handleDeleteCart(item.variantId)}>
                  x
                </button>

                <img
                  src={`http://localhost:8000${item.img}`}
                  alt={item.name}
                  className="w-[100px] h-[100px] object-cover rounded"
                />

                <div className="flex-1 grid grid-cols-10 items-center gap-4">
                  <div className="col-span-6">
                    <Link
                      to={`/product/${item.slug}`}
                      className="hover:text-blue-600 font-semibold block">
                      {item.name}
                    </Link>
                    <span className="text-sm text-gray-500">{item.size}</span>
                  </div>

                  <div className="col-span-2 text-right text-blue-600 font-medium text-base">
                    {item.totalPrice.toLocaleString()}₫
                  </div>

                  <div className="col-span-2">
                    <div className="border border-gray-300 rounded flex items-center justify-between px-2 py-1 w-fit mx-auto">
                      <button
                        className="text-lg font-bold px-2"
                        onClick={() => handleMinusStock(item.variantId)}>
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        className="text-lg font-bold px-2"
                        onClick={() => handlePushStock(item.variantId)}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Thanh toán bên phải */}
          <div className="w-full lg:w-[350px] p-4 rounded shadow-md border bg-white space-y-4 h-fit">
            <h4 className="font-semibold text-lg">Thanh toán</h4>

            <div className="text-right text-lg font-semibold text-gray-800">
              Tổng tiền:{" "}
              <span className="text-blue-600">
                {carts
                  .reduce((total, item) => total + item.totalPrice, 0)
                  .toLocaleString()}
                đ
              </span>
            </div>

            <select className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option>Chọn phương thức thanh toán</option>
              <option value="bank">Chuyển khoản</option>
              <option value="cash">Tiền mặt</option>
            </select>

            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded transition-colors duration-200"
              onClick={handlePay}>
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="flex justify-center mb-6">
            <img
              src="//theme.hstatic.net/200000881795/1001243022/14/cart_empty_background.png?v=152"
              alt="Giỏ hàng trống"
              className="w-64 h-auto object-contain"
            />
          </div>

          <h1 className="text-2xl mb-2">“Hổng” có gì trong giỏ hết</h1>
          <p className="text-gray-500 mb-4">
            Về trang cửa hàng để chọn mua sản phẩm bạn nhé!!
          </p>

          <Link
            to="/"
            className="inline-block border border-black rounded-lg px-6 py-3 hover:bg-black hover:text-white transition duration-300">
            Mua sắm ngay!
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;
