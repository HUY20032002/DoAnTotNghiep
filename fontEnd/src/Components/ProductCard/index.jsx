import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToWishlist, removeFromWishlist } from "~/redux/WishlistSlice";
import { toast } from "react-toastify";

const ProductCard = ({ data, isInWishlist }) => {
  const dispatch = useDispatch();
  const { productId, name, price, images, slug, _id } = data;
  const id = _id || productId; // Ưu tiên _id nếu có, fallback productId

  const handleHeart = (e) => {
    e.preventDefault();

    if (isInWishlist) {
      dispatch(removeFromWishlist(id));
      toast.info("Đã xóa khỏi yêu thích!");
    } else {
      dispatch(
        addToWishlist({
          productId: _id,
          name,
          price,
          images,
          slug,
        })
      );
      toast.success("Đã thêm vào yêu thích!");
    }
  };

  return (
    <Link
      to={`/product/${slug}`}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-[250px] sm:h-[350px] w-full">
        <img
          src={`http://localhost:8000${images?.[0] || ""}`}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0"
        />
        <img
          src={`http://localhost:8000${images?.[1] || ""}`}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:underline">
            {name}
          </h3>

          {/* Heart Icon */}
          <button
            onClick={handleHeart}
            className={`text-xl ${
              isInWishlist
                ? "text-red-500 hover:text-gray-500"
                : "text-gray-500 hover:text-red-500"
            } transition-colors duration-300`}
            title={isInWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}>
            <i className={isInWishlist ? "far fa-heart" : "far fa-heart"}></i>
          </button>
        </div>

        <p className="text-base text-gray-900 font-medium">
          {price.toLocaleString()}đ
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
