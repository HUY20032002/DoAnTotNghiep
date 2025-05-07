import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getTrashAllProducts,
  restoreProduct,
  destroyProduct,
  Categories,
} from "~/redux/apiRequest";
import ConfirmDestroyProduct from "~/Modals/ConfirmDestroyProduct"; // Modal chỉnh sửa sản phẩm
import { toast } from "react-toastify";
import Breadcrumb from "~/components/Breadcrumb"; // chỉnh lại đường dẫn nếu khác

const ManagerPtoductTrash = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const productList = useSelector(
    (state) => state.products.products?.allProducts
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDestroyModal, setShowDestroyModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories and trash products

  useEffect(() => {
    if (!user?.accessToken) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const catData = await Categories();
        if (catData?.data && Array.isArray(catData.data)) {
          setCategories(catData.data);
        } else {
          console.error("Invalid categories format:", catData);
        }
        getTrashAllProducts(dispatch, user.accessToken);
      } catch (error) {
        console.error("Fetch data error:", error);
      }
    };

    fetchData();
  }, [user, navigate, dispatch]);

  const handleDelete = (product) => {
    setCurrentProduct(product); // Lưu sản phẩm vào currentProduct
    setShowDestroyModal(true); // Hiển thị modal
  };

  const confirmDestroy = async () => {
    try {
      if (user?.accessToken && currentProduct?._id) {
        await destroyProduct(dispatch, currentProduct._id, user.accessToken);
        getTrashAllProducts(dispatch, user.accessToken);
        setShowDestroyModal(false);
        setCurrentProduct(null);
        toast.success("Xóa sản phẩm vĩnh viễn thành công");
      }
    } catch (error) {
      toast.error("Xóa sản phẩm vĩnh viễn thất bại");
    }
  };

  const handleRestore = async (id) => {
    try {
      if (user?.accessToken) {
        await restoreProduct(dispatch, id, user.accessToken);
        toast.success("Khôi phục sản phẩm thành công");
        getTrashAllProducts(dispatch, user.accessToken); // Load tất cả sản phẩm
      }
    } catch (error) {
      toast.error("Khôi phục sản phẩm thất bại");
    }
  };

  // Sử dụng useEffect để theo dõi sự thay đổi của currentProduct
  useEffect(() => {
    if (currentProduct) {
      console.log("Updated currentProduct:", currentProduct);
    }
  }, [currentProduct]);

  return (
    <div className="container mx-auto px-4 mt-[64px]">
      <Breadcrumb />

      <ConfirmDestroyProduct
        onClose={() => setShowDestroyModal(false)}
        onConfirm={confirmDestroy}
        show={showDestroyModal}
        product={currentProduct}
      />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Thùng Rác Sản Phẩm</h1>
        <div className="flex gap-2">
          <Link
            to="/admin/managerproduct"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300">
            Quản Lý Sản Phẩm
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-m uppercase">
            <tr>
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">Ảnh</th>
              <th className="py-2 px-4 text-left">Tên</th>
              <th className="py-2 px-4 text-left">Giá</th>
              <th className="py-2 px-4 text-left">Số lượng</th>
              <th className="py-2 px-4 text-left">Mô tả</th>
              <th className="py-2 px-4 text-left">Danh mục</th>
              <th className="py-2 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(productList) && productList.length > 0 ? (
              productList.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50 text-m">
                  <td className="py-2 px-4 text-left">{index + 1}</td>
                  <td className="py-2 px-4 text-left">
                    <img
                      src={`http://localhost:8000${product.image}`}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                  </td>
                  <td className="py-2 px-4 text-left">{product.name}</td>
                  <td className="py-2 px-4 text-left">
                    {product.price.toLocaleString()}₫
                  </td>
                  <td className="py-2 px-4 text-left">{product.stock}</td>
                  <td className="py-2 px-4 text-left max-w-[200px] truncate">
                    {product.description}
                  </td>
                  <td className="py-2 px-4 text-left">
                    {categories.find((cat) => cat._id === product.category)
                      ?.name || (
                      <span className="text-red-500 italic">Không rõ</span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        title="Khôi phục"
                        className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition"
                        onClick={() => handleRestore(product._id)}>
                        <i className="fas fa-trash-restore text-base"></i>
                      </button>
                      <button
                        title="Xóa vĩnh viễn"
                        className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition"
                        onClick={() => handleDelete(product)}>
                        <i className="fas fa-trash text-base"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500 italic">
                  Không có sản phẩm nào trong thùng rác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerPtoductTrash;
