import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getTrashProductVariant,
  restoreProductVariant,
} from "~/redux/apiRequest";
import Breadcrumb from "~/components/Breadcrumb";
import { toast } from "react-toastify";

const ProductVariantTrash = () => {
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
      getTrashProductVariant(dispatch, id);
    }
  }, [user, dispatch]);

  const handleRestore = async (id) => {
    try {
      await restoreProductVariant(dispatch, id);
      toast.success("Khôi phục thành công");
      handleSuccess();
    } catch (error) {
      toast.error("Khôi phục thất bại");
      console.log(error);
    }
  };

  const handleSuccess = () => {
    getTrashProductVariant(dispatch, id);
  };
  return (
    <div className="container mx-auto p-4 mt-[90px]">
      <Breadcrumb />
      <h1 className="text-2xl font-bold">Thùng Rác Biến Thể Sản Phẩm</h1>
      <div className="flex items-center justify-between m-4 text-right">
        <div className="flex gap-3 ml-auto">
          <Link
            to={`/admin/managerproduct/managerproductvariant/${id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300">
            Quản lý biến thể sản phẩm
          </Link>
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
                        onClick={() => handleRestore(product._id)}
                        className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition">
                        <i className="fas fa-trash-restore"></i>
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

export default ProductVariantTrash;
