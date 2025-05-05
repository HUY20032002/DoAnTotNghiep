import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getTrashAllProducts,
  restoreProduct,
  destroyProduct,
} from "~/redux/apiRequest";
import axios from "axios";
import ConfirmDestroyProduct from "~/Modals/ConfirmDestroyProduct"; // Modal chỉnh sửa sản phẩm

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
    } else {
      const fetchData = async () => {
        try {
          const cat = await axios.get("http://localhost:8000/categories/all");
          if (cat.data && cat.data.data && Array.isArray(cat.data.data)) {
            setCategories(cat.data.data);
          } else {
            console.error("Invalid categories data:", cat.data);
          }
          getTrashAllProducts(dispatch, user.accessToken); // Load sản phẩm
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      fetchData(); // GỌI async function
    }
  }, [user, dispatch, navigate]);

  const handleDelete = (product) => {
    console.log("Product to delete:", product); // Log giá trị sản phẩm trước khi set
    setCurrentProduct(product); // Lưu sản phẩm vào currentProduct
    setShowDestroyModal(true); // Hiển thị modal
  };

  const confirmDestroy = async () => {
    if (user?.accessToken && currentProduct?._id) {
      await destroyProduct(dispatch, currentProduct._id, user.accessToken);
      getTrashAllProducts(dispatch, user.accessToken);
      setShowDestroyModal(false);
      setCurrentProduct(null);
    }
  };

  const handleRestore = async (id) => {
    if (user?.accessToken) {
      await restoreProduct(dispatch, id, user.accessToken);
      getTrashAllProducts(dispatch, user.accessToken); // Load tất cả sản phẩm
    }
  };

  // Sử dụng useEffect để theo dõi sự thay đổi của currentProduct
  useEffect(() => {
    if (currentProduct) {
      console.log("Updated currentProduct:", currentProduct);
    }
  }, [currentProduct]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thùng Rác Sản Phẩm</h1>
      <ConfirmDestroyProduct
        onClose={() => setShowDestroyModal(false)}
        onConfirm={confirmDestroy}
        show={showDestroyModal}
        product={currentProduct}
      />
      <div className="w-fit">
        <Link
          to="/admin/managerproduct"
          className="text-blue-500 hover:underline mb-4 block">
          Quản lý Sản Phẩm
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Ảnh</th>
              <th className="py-2 px-4 border-b">Tên sản phẩm</th>
              <th className="py-2 px-4 border-b">Giá</th>
              <th className="py-2 px-4 border-b">Số lượng</th>
              <th className="py-2 px-4 border-b">Mô tả</th>
              <th className="py-2 px-4 border-b">Danh mục</th>
              <th className="py-2 px-4 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(productList) && productList.length > 0 ? (
              productList.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">
                    <img
                      src={`http://localhost:8000${product.image}`}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b">{product.price}₫</td>
                  <td className="py-2 px-4 border-b">{product.stock}</td>
                  <td className="py-2 px-4 border-b">{product.description}</td>
                  <td className="py-2 px-4 border-b">
                    {categories.find((cat) => cat._id === product.category)
                      ?.name || "Không rõ"}
                  </td>

                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center justify-center gap-2 h-full">
                      <button
                        className="text-blue-600 border border-blue-600 px-4 py-3 rounded-md hover:bg-blue-500 hover:text-white transition duration-300"
                        onClick={() => handleRestore(product._id)}>
                        <i className="fas fa-trash-restore"></i>
                      </button>

                      <button
                        className="text-red-600 border border-red-600 px-4 py-3 rounded-md hover:bg-red-500 hover:text-white transition duration-300"
                        onClick={() => handleDelete(product)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Chưa có sản phẩm nào.
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
