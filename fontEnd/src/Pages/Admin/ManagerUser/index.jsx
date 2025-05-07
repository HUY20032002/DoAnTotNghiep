import React, { useState, useEffect } from "react"; // Đảm bảo React được import
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers, SortDelete, UpdateUser } from "../../../redux/apiRequest";
import EditUser from "~/Modals/EditUser";
import { toast } from "react-toastify";
import Breadcrumb from "~/components/Breadcrumb";
const ManagerUser = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!user?.accessToken) {
      navigate("/login"); // Điều hướng đến trang login nếu không có accessToken
    } else {
      getAllUsers(user.accessToken, dispatch); // Lấy danh sách người dùng nếu có accessToken
    }
  }, [user, dispatch, navigate]);

  const handleDelete = async (id) => {
    try {
      if (user?.accessToken) {
        await SortDelete(dispatch, id, user.accessToken);
        getAllUsers(user.accessToken, dispatch);
        toast.success("Xóa người dùng thành công");
      }
    } catch (error) {
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
        getAllUsers(user.accessToken, dispatch);
        toast.success("Chỉnh sửa người dùng thành công");
        setShowModal(false);
      }
    } catch (error) {
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

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản Lý Người Dùng</h1>
        <div className="flex gap-2">
          <Link
            to="/admin/trashmanageruser"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300">
            Thùng Rác
          </Link>
        </div>
      </div>
      <h2 className="mb-4">
        Your Role:{" "}
        <span className="font-semibold">{user?.admin ? "Admin" : "User"}</span>
      </h2>

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
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.phone}</td>
                  <td className="py-2 px-4 border-b">{user.address}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex gap-2 h-full">
                      <button
                        className="text-blue-600 border border-blue-600 p-3 rounded-md hover:bg-blue-500 hover:text-white transition duration-300"
                        onClick={() => handleUpdate(user._id)}>
                        <i className="fas fa-user-edit"></i>
                      </button>

                      <button
                        className="text-red-600 border border-red-600 p-3 rounded-md hover:bg-red-500 hover:text-white transition duration-300"
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
                  Chưa có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerUser;
