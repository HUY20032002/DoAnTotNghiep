import { useState } from "react";
import { registerUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import Breadcrumb from "~/components/Breadcrumb"; // chỉnh nếu sai path
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const newUser = { email, password, name, phone };
    try {
      registerUser(newUser, dispatch, navigate)
        .then((message) => {
          toast.success(message);
          navigate("/login");
        })
        .catch((error) => {
          toast.error(error);
        });

      toast.success("Đăng ký thành công");
    } catch (error) {
      toast.error("Đăng ký thất bại");
    }
  };

  return (
    <div className="mt-[64px]">
      <Breadcrumb />
      <section className=" flex justify-center items-center ">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h3 className="text-3xl font-semibold text-center mb-6">Đăng ký</h3>
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700">
                  Tên
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Đăng ký
              </button>

              <div className="text-center mt-4 flex justify-center space-x-4">
                <Link
                  to="/forgotpassword"
                  className="text-blue-600 hover:text-blue-700">
                  Quên mật khẩu?
                </Link>
                <Link to="/login" className="text-blue-600 hover:text-blue-700">
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;
