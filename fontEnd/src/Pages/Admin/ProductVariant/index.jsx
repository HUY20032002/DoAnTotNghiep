import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getProductVariant, deleteProductVariant } from "~/redux/apiRequest";
import CreateProductVariant from "~/Modals/CreateProductVariant";
import EditProductVariant from "~/Modals/EditProductVariant";
import Breadcrumb from "~/components/Breadcrumb";
import { toast } from "react-toastify";

const ProductVariant = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const productList = useSelector(
    (state) => state.productVariants.productVariants?.allProductVariants
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //   Lấy Id từ cha (Product)
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState("");

  useEffect(() => {
    if (!user?.accessToken) {
      navigate("/login");
      return;
    } else {
      getProductVariant(dispatch, id);
    }
  }, [user, dispatch, id]);

  const handleCreate = () => {
    setShowModal(true);
    setIsEditing(false);
  };
  const handleUpdate = (id) => {
    const product = productList.find((p) => p._id === id);
    if (!product) return;
    setCurrentProduct(product);
    setShowModal(true);
    setIsEditing(true);
  };
  const handleDelete = async (id) => {
    try {
      await deleteProductVariant(dispatch, id);
      handleSuccess();
      toast.success("Xóa sản phẩm thành công");
    } catch {
      toast.error("Xóa sản phẩm thất bại");
    }
  };

  const handleSuccess = () => {
    getProductVariant(dispatch, id);
  };
  return (
    <div className="container mx-auto p-4 mt-[64px]">
      <Breadcrumb />
      <CreateProductVariant
        show={showModal && !isEditing}
        onClose={() => setShowModal(false)}
        onCreateSuccess={handleSuccess}
        productId={id}
      />
      <EditProductVariant
        show={showModal && isEditing}
        onClose={() => setShowModal(false)}
        onCreateSuccess={handleSuccess}
        productId={id}
        productVariant={currentProduct}
      />
      <h1 className="text-2xl font-bold">Quản Lý Biến Thể Sản Phẩm</h1>
      <div className="flex items-center justify-between mb-4 text-right">
        <div className="flex gap-3 ml-auto">
          <Link
            to={`/admin/productvarianttrash/${id}`}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300">
            Thùng Rác Sản Phẩm
          </Link>
          <button
            onClick={handleCreate}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300">
            Thêm Biến Thể
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-700 text-m uppercase">
            <tr>
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">Giá</th>
              <th className="py-2 px-4 text-left">Số lượng</th>
              <th className="py-2 px-4 text-left">Kích thước</th>
              <th className="py-2 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(productList) && productList.length > 0 ? (
              productList.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50 text-m">
                  <td className="py-2 px-4 text-left">{index + 1}</td>
                  <td className="py-2 px-4 text-left">
                    {product.price.toLocaleString()}₫
                  </td>
                  <td className="py-2 px-4 text-left">{product.stock}</td>

                  <td className="py-2 px-4 text-left">{product.size}</td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex justify-center gap-3">
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

export default ProductVariant;
