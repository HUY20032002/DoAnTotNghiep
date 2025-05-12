import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCard from "~/Components/ProductCard";
import { ShowProduct } from "~/redux/apiRequest"; // giả sử bạn đang dùng action này

const Home = () => {
  const productList =
    useSelector((state) => state.products.products?.allProducts) || [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    ShowProduct(dispatch);
  }, []);

  return (
    <div className="container mx-auto p-4 mt-[64px]">
      <h2 className="text-2xl font-semibold mb-6">Sản phẩm nổi bật</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productList.map((product) => (
          <ProductCard
            key={product._id} // Đảm bảo _id là duy nhất nếu id không phải
            name={product.name}
            price={product.price}
            image={product.image}
            hoverImage={product.hoverimage}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
