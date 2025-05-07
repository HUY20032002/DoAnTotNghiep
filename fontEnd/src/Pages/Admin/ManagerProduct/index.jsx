import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllProducts,
  SortDeleteProduct,
  Categories,
} from "~/redux/apiRequest";
import CreateProduct from "~/Modals/CreateProduct";
import EditProduct from "~/Modals/EditProduct";
import Breadcrumb from "~/components/Breadcrumb";
import { toast } from "react-toastify";

const ManagerProduct = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const productList = useSelector(
    (state) => state.products.products?.allProducts
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
        }
        getAllProducts(dispatch, user.accessToken);
      } catch (error) {
        console.error("Fetch data error:", error);
      }
    };

    fetchData();
  }, [user, navigate, dispatch]);

  const handleDelete = async (id) => {
    try {
      await SortDeleteProduct(dispatch, id, user.accessToken);
      getAllProducts(dispatch, user.accessToken);
      toast.success("Xóa sản phẩm thành công");
    } catch {
      toast.error("Xóa sản phẩm thất bại");
    }
  };

  const handleUpdate = (id) => {
    const product = productList.find((p) => p._id === id);
    if (!product) return;
    setCurrentProduct(product);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCreate = () => {
    setShowModal(true);
    setIsEditing(false);
  };

  const handleCreateSuccess = () => {
    getAllProducts(dispatch, user.accessToken);
  };

  return (
    <div className="container mx-auto p-4 mt-[64px]">
      <Breadcrumb />
      <CreateProduct
        show={showModal && !isEditing}
        onClose={() => setShowModal(false)}
        onCreateSuccess={handleCreateSuccess}
      />
      <EditProduct
        show={showModal && isEditing}
        onClose={() => setShowModal(false)}
        onCreateSuccess={handleCreateSuccess}
        product={currentProduct}
      />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản Lý Sản Phẩm</h1>
        <div className="flex gap-3">
          <Link
            to="/admin/trashmanagerproduct"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300">
            Thùng Rác Sản Phẩm
          </Link>
          <button
            onClick={handleCreate}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300">
            Thêm Sản Phẩm
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto">
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
                      className="w-16 h-16 object-cover rounded"
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
                    {categories.find((c) => c._id === product.category)?.name ||
                      "Không rõ"}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleUpdate(product._id)}
                        className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition">
                        <i className="fas fa-trash"></i>
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

export default ManagerProduct;
