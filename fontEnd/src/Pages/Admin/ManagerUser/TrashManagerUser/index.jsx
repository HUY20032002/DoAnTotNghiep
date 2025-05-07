import "@fortawesome/fontawesome-free/css/all.min.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTrashAllUsers, restoreUser, DestroyUser } from "~/redux/apiRequest";
import React from "react";
import ConfirmDestroyUser from "~/Modals/ConfirmDestroyUser";
import { toast } from "react-toastify";
import Breadcrumb from "~/components/Breadcrumb";

const TrashManagerUser = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user?.accessToken) {
      getTrashAllUsers(user.accessToken, dispatch);
    }
  }, [user, dispatch, navigate]);

  const [showDestroyModal, setShowDestroyModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Trả lại người dùng
  const handleRestore = async (id) => {
    try {
      if (user?.accessToken) {
        await restoreUser(dispatch, id, user.accessToken);
        getTrashAllUsers(user.accessToken, dispatch);
      }
      toast.success("Khôi phục người dùng thành công");
    } catch (error) {
      toast.error("Khôi phục người dùng thất bại");
    }
  };

  const handleDestroy = (user) => {
    setCurrentUser(user);
    setShowDestroyModal(true);
  };

  const confirmDestroy = async () => {
    try {
      if (user?.accessToken && currentUser?._id) {
        await DestroyUser(dispatch, currentUser._id, user.accessToken);
        getTrashAllUsers(user.accessToken, dispatch);
        setShowDestroyModal(false);
        setCurrentUser(null);
        toast.success("Xóa vĩnh viễn người dùng thành công");
      }
    } catch (error) {
      toast.success("Xóa vĩnh viễn người dùng thành công");
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[64px]">
      <Breadcrumb />

      <ConfirmDestroyUser
        show={showDestroyModal}
        onClose={() => setShowDestroyModal(false)}
        onConfirm={confirmDestroy}
        user={currentUser}
      />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Người Dùng Đã Xóa</h1>
        <div className="flex gap-2">
          <Link
            to="/admin/manageruser"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300">
            Quản Lý Người Dùng
          </Link>
        </div>
      </div>
      <h2 className="mb-6">
        Your Role:{" "}
        <span className="font-semibold">{user?.admin ? "Admin" : "User"}</span>
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr className="text-left">
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
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      className="text-blue-600 border border-blue-600 p-3  rounded-md hover:bg-blue-500 hover:text-white transition duration-300"
                      onClick={() => handleRestore(user._id)}>
                      <i className="fas fa-trash-restore"></i>{" "}
                    </button>
                    <button
                      className="text-red-600 border border-red-600 p-3  rounded-md hover:bg-red-500 hover:text-white transition duration-300"
                      onClick={() => handleDestroy(user)}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Chưa có người dùng nào đã xóa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrashManagerUser;
