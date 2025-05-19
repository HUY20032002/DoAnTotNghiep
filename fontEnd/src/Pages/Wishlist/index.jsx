import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "~/components/ProductCard";
import Breadcrumb from "~/components/Breadcrumb";

function Wishlist() {
  const wishlist = useSelector((state) => state.wishlist?.items);

  return (
    <div className="container mx-auto p-4 mt-[64px]">
      <Breadcrumb />
      <div>
        <h2 className="text-2xl font-semibold mb-4">Sản phẩm yêu thích</h2>

        {wishlist.length === 0 ? (
          <p className="text-gray-600 text-center mt-10">
            Bạn chưa có sản phẩm yêu thích nào.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product, key) => (
              <ProductCard key={key} data={product} isInWishlist={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
