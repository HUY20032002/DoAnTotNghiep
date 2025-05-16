import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ShowDetail, Categories, getProductVariant } from "~/redux/apiRequest";
import Breadcrumb from "~/components/Breadcrumb";
import { addToCart } from "~/redux/cartSlice";

const Detail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [category, setCategory] = useState([]);
  const detail = useSelector((state) => state.products.products?.allProducts);
  const productVariantId = detail?._id;
  const detailVariantList = useSelector(
    (state) => state.productVariants.productVariants?.allProductVariants
  );
  const [stock, setStock] = useState(1);
  const [showStockFor, setShowStockFor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null); // Biến thể đang chọn

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cat = await Categories();
        setCategory(cat.data);
        await ShowDetail(dispatch, slug);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      }
    };
    if (slug) fetchData();
  }, [slug, dispatch]);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        if (productVariantId) {
          await getProductVariant(dispatch, productVariantId);
        }
      } catch (error) {
        console.error("Lỗi khi lấy biến thể sản phẩm:", error);
      }
    };
    fetchVariant();
  }, [dispatch, productVariantId]);

  const getCategoryName = (catId) => {
    const match = category.find((item) => item._id === catId);
    return match ? match.name : "Không tìm thấy danh mục";
  };

  const handleMinusStock = () => {
    setStock((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handlePushStock = () => {
    if (selectedVariant && stock < selectedVariant.stock) {
      setStock((prev) => prev + 1);
    }
  };

  const handleSelectVariant = (variant) => {
    setShowStockFor(variant._id);
    setSelectedVariant(variant);
    setStock(1); // Reset lại số lượng mỗi khi chọn size mới
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      dispatch(
        addToCart({
          productId: detail._id,
          variantId: selectedVariant._id,
          quantity: stock,
        })
      );
    }
  };

  return (
    <div className="container p-4 mt-[64px]">
      <Breadcrumb />
      {detail ? (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold">{detail.name}</h2>
          <img
            src={`http://localhost:8000${detail.image}`}
            alt={detail.name}
            className="w-64 h-64 object-cover mb-4"
          />
          <p>Giá: {detail.price?.toLocaleString()}đ</p>
          <p>Danh mục: {getCategoryName(detail.category)}</p>
          <p>{detail.description}</p>

          <div className="my-4">
            {detailVariantList?.map((detailVariant) => {
              const isOutOfStock = detailVariant.stock === 0;
              return (
                <React.Fragment key={detailVariant._id}>
                  <button
                    onClick={() => handleSelectVariant(detailVariant)}
                    className={`p-2 m-2 rounded ${
                      isOutOfStock
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : showStockFor === detailVariant._id
                        ? "bg-yellow-700 text-white"
                        : "bg-yellow-500"
                    }`}
                    disabled={isOutOfStock}>
                    {detailVariant.size} {isOutOfStock && " (Hết hàng)"}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {selectedVariant && (
            <>
              <p className="text-green-700 font-semibold">
                Còn lại: {selectedVariant.stock} sản phẩm
              </p>

              <div className="flex items-center space-x-4 my-4">
                <button
                  className="bg-red-200 px-3 py-1 rounded"
                  onClick={handleMinusStock}>
                  -
                </button>
                <span>{stock}</span>
                <button
                  className="bg-red-200 px-3 py-1 rounded"
                  onClick={handlePushStock}>
                  +
                </button>
              </div>

              <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                onClick={handleAddToCart}>
                Thêm vào giỏ hàng
              </button>
            </>
          )}
        </div>
      ) : (
        <p>Đang tải chi tiết sản phẩm...</p>
      )}
    </div>
  );
};

export default Detail;
