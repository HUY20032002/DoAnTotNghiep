import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers, SortDelete, UpdateUser } from "../../../redux/apiRequest";
import EditUser from "~/Modals/EditUser";
import { toast } from "react-toastify";
import Breadcrumb from "~/components/Breadcrumb";

const User = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user?.accessToken) {
      navigate("/login");
    } else {
      getAllUsers(user.accessToken, dispatch, page, keyword, setTotalPages);
    }
  }, [user, dispatch, navigate, page, keyword]);

  const handleDelete = async (id) => {
    try {
      if (user?.accessToken) {
        await SortDelete(dispatch, id, user.accessToken);
        getAllUsers(user.accessToken, dispatch, page, keyword, setTotalPages);
        toast.success("Xóa người dùng thành công");
      }
    } catch {
      toast.error("Xóa người dùng thất bại");
    }
  };

  const handleUpdate = (id) => {
    const selectedUser = userList.find((u) => u._id === id);
    setCurrentUser(selectedUser);
    setShowModal(true);
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      if (user?.accessToken && currentUser?._id) {
        await UpdateUser(
          dispatch,
          currentUser._id,
          updatedUser,
          user.accessToken
        );
        getAllUsers(user.accessToken, dispatch, page, keyword, setTotalPages);
        toast.success("Chỉnh sửa người dùng thành công");
        setShowModal(false);
      }
    } catch {
      toast.error("Chỉnh sửa người dùng thất bại");
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[64px]">
      <Breadcrumb />
      <EditUser
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveUser}
        user={currentUser}
      />
      <h1 className="text-2xl font-bold">Quản Lý Người Dùng</h1>
      <div className="flex items-center justify-between mb-4">
        {" "}
        <div className="">
          {" "}
          <label htmlFor="" className="p-2 font-bold">
            Tìm kiếm:
          </label>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            className="border rounded px-3 py-2 my-3"
            value={keyword}
            onChange={(e) => {
              setPage(1);
              setKeyword(e.target.value);
            }}
          />
        </div>
        <Link
          to="/admin/trashmanageruser"
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300">
          Thùng Rác
        </Link>
      </div>

      {/* <h2 className="mb-4">
        Your Role:{" "}
        <span className="font-semibold">{user?.admin ? "Admin" : "User"}</span>
      </h2> */}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Tên</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Điện Thoại</th>
              <th className="py-2 px-4 border-b">Địa chỉ</th>
              <th className="py-2 px-4 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(userList) && userList.length > 0 ? (
              userList.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {(page - 1) * 5 + index + 1}
                  </td>
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.phone}</td>
                  <td className="py-2 px-4 border-b">{user.address}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 border border-blue-600 p-2 rounded hover:bg-blue-500 hover:text-white"
                        onClick={() => handleUpdate(user._id)}>
                        <i className="fas fa-user-edit"></i>
                      </button>
                      <button
                        className="text-red-600 border border-red-600 p-2 rounded hover:bg-red-500 hover:text-white"
                        onClick={() => handleDelete(user._id)}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-4">
        <button
          // Giảm số trang xuống 1 đơn vị nhưng không nhỏ hơn 1
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          // Vô hiệu hóa khi page = 1
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
          Trang trước
        </button>
        <span className="self-center">
          {/* Hiển thị số trang còn lại */}
          Trang {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default User;
