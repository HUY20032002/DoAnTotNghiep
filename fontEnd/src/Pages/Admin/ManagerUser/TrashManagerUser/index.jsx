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
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user?.accessToken) {
      getTrashAllUsers(
        user.accessToken,
        dispatch,
        page,
        keyword,
        setTotalPages
      );
    }
  }, [user, dispatch, navigate, page, keyword]);

  const [showDestroyModal, setShowDestroyModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Trả lại người dùng
  const handleRestore = async (id) => {
    try {
      if (user?.accessToken) {
        await restoreUser(dispatch, id, user.accessToken);
        getTrashAllUsers(user.accessToken, dispatch, page, keyword, setPage);
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
        getTrashAllUsers(user.accessToken, dispatch, page, keyword, setPage);
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
      <h1 className="text-2xl font-bold">Người Dùng Đã Xóa</h1>
      <div className="flex items-center justify-between mb-4">
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
        <div className="flex gap-2">
          <Link
            to="/admin/manageruser"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300">
            Quản Lý Người Dùng
          </Link>
        </div>
      </div>
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
      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || totalPages === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
          Trang trước
        </button>
        <span className="self-center">
          Trang {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || totalPages === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default TrashManagerUser;
