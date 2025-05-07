import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../redux/apiRequest";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumb from "~/components/Breadcrumb"; // chỉnh nếu sai path

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateLogin = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Email không hợp lệ!");
      return false;
    }
    if (!password) {
      toast.error("Mật khẩu không được để trống!");
      return false;
    }
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = { email, password };
    try {
      if (!validateLogin()) return;

      loginUser(user, dispatch, navigate);
      toast.success("Đăng nhập thành công");
    } catch (error) {
      toast.error("Đăng nhập thất bại");
    }
  };

  return (
    <div className="mt-[64px]">
      {" "}
      <Breadcrumb />
      <section className=" flex justify-center items-center ">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h3 className="text-3xl font-semibold text-center mb-6">
              Đăng nhập
            </h3>
            <form onSubmit={handleLogin}>
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
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Đăng nhập
              </button>

              <div className="flex justify-center gap-x-4 text-sm mt-6">
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-700">
                  Đăng ký
                </Link>
                <Link
                  to="/forgotpassword"
                  className="text-blue-600 hover:text-blue-700">
                  Quên mật khẩu
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
