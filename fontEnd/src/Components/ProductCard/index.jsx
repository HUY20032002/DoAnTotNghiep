import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToWishlist } from "~/redux/WishlistSlice";
import { toast } from "react-toastify";

const ProductCard = ({ data }) => {
  const dispatch = useDispatch();
  const { _id, name, price, image, hoverimage, slug } = data;

  const handleHeart = (e) => {
    e.preventDefault(); // ngăn redirect khi click icon trong thẻ <Link>
    dispatch(
      addToWishlist({
        productId: _id,
        name,
        price,
        image,
      })
    );
    toast.success("Đã thêm vào yêu thích!");
  };

  return (
    <Link
      to={`/product/${slug}`}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-[300px] sm:h-[400px] w-full">
        <img
          src={`http://localhost:8000${image}`}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0"
        />
        <img
          src={`http://localhost:8000${hoverimage}`}
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
            className="text-gray-500 hover:text-red-500 transition-colors duration-300"
            title="Thêm vào yêu thích">
            <i className="far fa-heart text-lg"></i>
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
