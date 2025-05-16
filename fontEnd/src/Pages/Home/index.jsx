import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCard from "~/Components/ProductCard";
import { ShowProduct } from "~/redux/apiRequest"; // giả sử bạn đang dùng action này
import Breadcrumb from "~/components/Breadcrumb";

const Home = () => {
  // Lấy state `products` trong Redux, bên trong đó có `products` (tên trùng do bạn đặt vậy)
  const raw = useSelector((state) => state.products.products);

  // Kiểm tra nếu raw?.allProducts là một mảng hợp lệ thì gán vào productList,
  // ngược lại gán mảng rỗng [] để tránh lỗi `.map is not a function`
  const productList = Array.isArray(raw?.allProducts) ? raw.allProducts : [];

  // In ra để kiểm tra `raw` có đúng structure như kỳ vọng hay không
  console.log("rawProducts: ", raw);

  const dispatch = useDispatch();

  useEffect(() => {
    ShowProduct(dispatch);
  }, []);

  return (
    <div className="container p-4 mt-[64px]">
      <Breadcrumb />
      <h2 className="text-2xl font-semibold mb-6">Sản phẩm nổi bật</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productList.map((product, key) => (
          <ProductCard key={key} data={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
