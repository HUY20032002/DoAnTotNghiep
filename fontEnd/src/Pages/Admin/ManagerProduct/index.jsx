import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts, SortDeleteProduct } from "~/redux/apiRequest";
import CreateProduct from "~/Modals/CreateProduct";
import EditProduct from "~/Modals/EditProduct";

import axios from "axios";
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
  const [isEditing, setIsEditing] = useState(false); // Trạng thái cho modal sửa hay tạo sản phẩm

  useEffect(() => {
    if (!user?.accessToken) {
      navigate("/login");
    } else {
      // Tạo async function bên trong useEffect
      const fetchData = async () => {
        try {
          const cat = await axios.get("http://localhost:8000/categories/all");
          if (cat.data && cat.data.data && Array.isArray(cat.data.data)) {
            setCategories(cat.data.data);
          } else {
            console.error("Invalid categories data:", cat.data);
          }
          getAllProducts(dispatch, user.accessToken); // Load sản phẩm
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      fetchData(); // GỌI async function
    }
  }, [user, dispatch, navigate]);

  const handleDelete = async (id) => {
    if (user?.accessToken) {
      await SortDeleteProduct(dispatch, id, user.accessToken);
      // console.log(id);
      getAllProducts(dispatch, user.accessToken); // Load tất cả sản phẩm
    }
  };

  const handleUpdate = (id) => {
    const selectedProduct = productList.find((p) => p._id === id);
    if (!selectedProduct) {
      console.error("Không tìm thấy sản phẩm để sửa với id:", id);
      return;
    }
    setCurrentProduct(selectedProduct);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCreate = () => {
    setShowModal(true);
    setIsEditing(false);
  };
  const handleCreateSuccess = () => {
    getAllProducts(dispatch, user.accessToken); // Tải lại danh sách sản phẩm
  };

  return (
    <div className="container mx-auto p-4">
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
      <h1 className="text-2xl font-bold mb-4">Quản Lý Sản Phẩm</h1>
      <Link
        to="/admin/trashmanagerproduct"
        className="text-blue-500 hover:underline mb-4 block">
        Thùng Rác Sản Phẩm
      </Link>
      <button onClick={() => handleCreate()}>Thêm sản phẩm </button>
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
                        onClick={() => handleUpdate(product._id)}>
                        <i className="fas fa-edit"></i>
                      </button>

                      <button
                        className="text-red-600 border border-red-600 px-4 py-3 rounded-md hover:bg-red-500 hover:text-white transition duration-300"
                        onClick={() => handleDelete(product._id)}>
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

export default ManagerProduct;
