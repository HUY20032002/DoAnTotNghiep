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

const Product = () => {
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
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
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

        // Log dữ liệu trả về từ API
        const response = await getAllProducts(
          dispatch,
          user.accessToken,
          page,
          keyword,
          selectedCategory
        );
      } catch (error) {
        console.error("Fetch data error:", error);
      }
    };

    fetchData();
  }, [user, dispatch, page, keyword, selectedCategory]);
  const handleDelete = async (id) => {
    try {
      await SortDeleteProduct(dispatch, id, user.accessToken);
      getAllProducts(
        dispatch,
        user.accessToken,
        page,
        keyword,
        selectedCategory
      );
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
    getAllProducts(dispatch, user.accessToken, page, keyword, selectedCategory);
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
      <h1 className="text-2xl font-bold">Quản Lý Sản Phẩm</h1>
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
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded">
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
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
              <th className="py-2 px-4 text-left">Ảnh Hover</th>
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
                  <td className="py-2 px-4 text-left">
                    <img
                      src={`http://localhost:8000${product.hoverimage}`}
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
                    <div className="flex justify-center gap-3">
                      <Link
                        // onClick={() => handleOpenProductVariant(product._id)}
                        to={`/admin/managerproduct/managerproductvariant/${product._id}`}
                        className="text-green-600 border border-green-600 px-3 py-1 rounded hover:bg-green-500 hover:text-white transition">
                        <i className="fas fa-edit"></i>
                      </Link>
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
      {/* Phân trang */}
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

export default Product;
