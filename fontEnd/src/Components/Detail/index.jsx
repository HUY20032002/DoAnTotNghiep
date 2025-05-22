import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ShowDetail, Categories, getProductVariant } from "~/redux/apiRequest";
import Breadcrumb from "~/components/Breadcrumb";
import { addToCart } from "~/redux/cartSlice";
import { toast } from "react-toastify";

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
  const [checkSize, setCheckSize] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (detail?.images?.length > 0) {
      setSelectedImage(detail.images[0]);
    }
  }, [detail]);

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
    if (!checkSize) {
      toast.error("Vui Lòng Chọn Size Sản Phẩm");
    } else {
      setStock((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const handlePushStock = () => {
    if (!checkSize) {
      toast.error("Vui Lòng Chọn Size Sản Phẩm");
    } else {
      if (selectedVariant && stock < selectedVariant.stock) {
        setStock((prev) => prev + 1);
      }
    }
  };

  const handleSelectVariant = (variant) => {
    setShowStockFor(variant._id);
    setSelectedVariant(variant);
    setStock(1); // Reset lại số lượng mỗi khi chọn size mới
    setCheckSize(true);
  };

  const handleAddToCart = () => {
    if (!checkSize) {
      toast.error("Vui Lòng Chọn Size Sản Phẩm");
    } else {
      if (selectedVariant) {
        dispatch(
          addToCart({
            productId: detail._id,
            variantId: selectedVariant._id,
            variantStock: selectedVariant.stock,
            quantity: stock,
            price: detail.price,
            img: detail.images?.[0] || "",
            name: detail.name,
            slug: detail.slug,
            size: selectedVariant.size,
          })
        );
      }
    }
  };
  // console.log(detailVariantList);
  return (
    <div className="container p-4 mt-[64px]">
      <Breadcrumb />
      <div className="container mx-auto p-4 mt-16 grid grid-cols-12 gap-6">
        {/* Left thumbnails */}
        {/* Left thumbnails */}
        <div className="col-span-1">
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
            {detail?.images?.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:8000${img}`}
                alt={`Ảnh ${index + 1}`}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-24 object-cover rounded-md cursor-pointer border ${
                  selectedImage === img ? "border-blue-500" : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main image */}
        <div className="col-span-5 flex items-center justify-center">
          {selectedImage && (
            <img
              src={`http://localhost:8000${selectedImage}`}
              alt="Ảnh chính"
              className="w-full max-h-[600px] object-contain rounded-lg"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="col-span-6 space-y-4">
          <h1 className="text-2xl font-semibold">{detail?.name}</h1>
          <p className="text-gray-500">
            Mã SP: <span>Đang cập nhật</span>
          </p>

          <div className="text-blue-600 font-bold text-2xl">
            {detail?.price?.toLocaleString()}đ
          </div>

          <div className="border border-blue-400 p-4 rounded-lg">
            <p className="text-blue-600 font-medium mb-2">
              🎁 KHUYẾN MÃI - ƯU ĐÃI
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Chuyển khoản với đơn hàng từ 500k trở lên (Bắt buộc)</li>
              <li>Đóng gói ship toàn quốc 30k</li>
              <li>Hỗ trợ trả lời thắc mắc qua fanpage chính thức</li>
              <li>Khuyến mãi trực tiếp trên giá sản phẩm</li>
              <li>Đổi trả nếu sản phẩm lỗi bất kì</li>
            </ul>
          </div>

          {/* Size selection */}
          <div>
            <p>Size:</p>
            <div className="flex gap-2 mt-2">
              {detailVariantList && detailVariantList.length > 0 ? (
                detailVariantList.map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() => handleSelectVariant(variant)}
                    className={`px-3 py-1 border rounded cursor-pointer ${
                      selectedVariant?._id === variant._id
                        ? "border-blue-500 bg-blue-100"
                        : "border-gray-300"
                    }`}>
                    {variant.size || "Không có size"}
                  </button>
                ))
              ) : (
                <p>Hết Hàng</p>
              )}
            </div>
          </div>
          {/* Show Stock Size */}
          <div className="">
            {/* Show Stock Size */}
            {selectedVariant && (
              <div className="mt-2 text-xl text-gray-600">
                Còn lại:{" "}
                <span className="font-semibold text-black">
                  {selectedVariant.stock}
                </span>{" "}
                sản phẩm
              </div>
            )}
          </div>
          <div className="gird gird-col-2 gap-2 flex items-center justify-center">
            {" "}
            <div className="border-2 border-solid w-[30%] rounded px-5 py-2">
              <div className="flex items-center justify-center">
                {" "}
                <button className="btn-minus px-5 " onClick={handleMinusStock}>
                  -
                </button>
                <p className="px-8">{stock}</p>
                <button className="btn-push px-5 " onClick={handlePushStock}>
                  +
                </button>
              </div>
            </div>
            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 w-[70%]">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                THÊM VÀO GIỎ
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full">
            <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              MUA NGAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
