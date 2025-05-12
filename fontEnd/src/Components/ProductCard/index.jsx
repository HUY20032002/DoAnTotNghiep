import React from "react";

const ProductCard = ({ name, price, image, hoverImage }) => {
  return (
    <a href="#" className="group block overflow-hidden">
      <div className="relative h-[350px] sm:h-[450px]">
        <img
          src={`http://localhost:8000${image}`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-100 group-hover:opacity-0"
        />
        <img
          src={`http://localhost:8000${hoverImage}`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>

      <div className="relative bg-white pt-3">
        <h3 className="text-sm text-gray-700 group-hover:underline group-hover:underline-offset-4">
          {name}
        </h3>
        <p className="mt-1.5 tracking-wide text-gray-900">${price}</p>
      </div>
    </a>
  );
};

export default ProductCard;
