import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UpdateUser, logoutUser } from "../../redux/apiRequest";
import React from "react";

function Profile() {
  const user = useSelector((state) => state.auth.login?.currentUser);

  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const id = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Active Button
  const [activeTab, setActiveTab] = useState("info");
  const handleLogout = () => {
    logoutUser(dispatch, id, navigate); // Xử lý logout
  };
  const handleUpate = async (UserId) => {
    const User = {
      name,
      phone,
      address,
    };

    if (user?.accessToken && UserId) {
      try {
        await UpdateUser(dispatch, UserId, User, user.accessToken);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, name, address, phone })
        );
        toast.success("Cập nhật thông tin thành công!");

        // Cập nhật lại localStorage sau khi thành công
      } catch (error) {
        toast.error("Đã có lỗi xảy ra khi cập nhật thông tin!");
        console.error(error);
      }
    }
  };

  return (
    <div className="">
      <ToastContainer />
      <nav aria-label="Breadcrumb" className="bg-gray-200 w-full">
        <ol className="p-1 flex items-center gap-1 text-sm text-gray-700 ">
          <li>
            <a href="/" className="block transition-colors hover:text-gray-900">
              {" "}
              Trang chủ{" "}
            </a>
          </li>
          <li className="rtl:rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </li>
          <li>
            <a
              href="/profile"
              className="block transition-colors hover:text-gray-900">
              {" "}
              Tài Khoản{" "}
            </a>
          </li>
        </ol>
      </nav>
      <div className="grid grid-cols-[1fr_1px_3fr] container">
        {/* Cột vàng */}
        <div className=" p-4">
          <div className="text-center">Trang Tài Khoản</div>
          <div>
            <button
              onClick={() => setActiveTab("info")}
              className={`w-full p-2 mb-2 ${
                activeTab === "info"
                  ? "bg-blue-500 text-white"
                  : "bg-yellow-200 text-black"
              }`}>
              Thông tin tài khoản
            </button>
          </div>
          <div>
            <button
              onClick={() => setActiveTab("edit")}
              className={`w-full p-2 mb-2 ${
                activeTab === "edit"
                  ? "bg-blue-500 text-white"
                  : "bg-yellow-200 text-black"
              }`}>
              Sửa thông tin
            </button>{" "}
          </div>
          <div>
            <button
              className="w-full p-2 bg-red-500 text-white"
              onClick={handleLogout}>
              Đăng Xuất
            </button>
          </div>
        </div>

        {/* Đường kẻ ngăn cách */}
        <div className="bg-gray-500 "></div>

        {/* Cột xanh */}
        {/* Cột xanh */}
        <div className="p-4">
          {activeTab == "info" && (
            <div>
              <div className="">Thông tin Tài Khoản</div>

              <div className="">Tên tài khoản: {user?.name}</div>
              <div className="">Địa chỉ: {user?.address}</div>
              <div className="">Điện Thoại: {user?.phone}</div>
              <div className="">Đơn Hàng của bạn</div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y-2 divide-gray-200">
                  <thead className="ltr:text-left rtl:text-right">
                    <tr className="*:font-medium *:text-gray-900">
                      <th className="px-3 py-2 whitespace-nowrap">
                        Mã đơn hàng
                      </th>
                      <th className="px-3 py-2 whitespace-nowrap">Ngày đặt</th>
                      <th className="px-3 py-2 whitespace-nowrap">
                        Thành Tiền
                      </th>
                      <th className="px-3 py-2 whitespace-nowrap">
                        TT Thanh Toán
                      </th>
                      <th className="px-3 py-2 whitespace-nowrap">
                        TT Vận Chuyển
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="*:text-gray-900 *:first:font-medium">
                      <td className="px-3 py-2 whitespace-nowrap">
                        Nandor the Relentless
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        04/06/1262
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        Vampire Warrior
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">$0</td>
                      <td className="px-3 py-2 whitespace-nowrap">Pending</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab == "edit" && (
            <div>
              <div className="text-lg font-semibold mb-2">
                Sửa Thông Tin Tài Khoản
              </div>
              <input
                type="text"
                placeholder="Tên mới"
                className="border block mb-2 p-2 w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Địa chỉ mới"
                className="border block mb-2 p-2 w-full"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                type="text"
                placeholder="Số điện thoại mới"
                className="border block mb-2 p-2 w-full"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white p-2 mt-2"
                onClick={() => handleUpate(user._id)}>
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
