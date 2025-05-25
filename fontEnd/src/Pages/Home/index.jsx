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
  // console.log("rawProducts: ", raw);

  const dispatch = useDispatch();

  useEffect(() => {
    ShowProduct(dispatch);
  }, []);

  return (
    <div className="container p-4 mt-[64px]">
      <Breadcrumb />
      <section className="section awe-section-1 section-section_slider">
        <div className="section_slider clearfix">
          <div className=" container py-2 ">
            <div className="home-slider slick-initialized slick-slider">
              <img
                src="https://scontent.fhan18-1.fna.fbcdn.net/v/t39.30808-6/486488007_663016939597879_8101077087028759020_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeGiwgdVZyAeNzNXtw_6Kl8TtUR0YcNYP7O1RHRhw1g_sxsSW7fpLOeGkUw5MNBYrjanHDBZTiSnSdVpuHYLmW7O&_nc_ohc=hk-rAL5F43gQ7kNvwH5cI1-&_nc_oc=AdlQ2C4nf0YuU-hdsUdtYaDyq8fVBBlfCr6rr_s61vjmaAF9SOELBcbUH4bh3RjwRTI&_nc_zt=23&_nc_ht=scontent.fhan18-1.fna&_nc_gid=HiFOkm4ky7pCVkX421oK_w&oh=00_AfKuZiT4kZcyUQFLjKJJ6sR9FWwalF1Exmh6mKNWo8g-Jg&oe=68376CB3"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
      <h2 className="text-2xl font-semibold mb-6">Sản phẩm nổi bật</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productList.map((product, key) => (
          <ProductCard key={key} data={product} heart={false} />
        ))}
      </div>
    </div>
  );
};

export default Home;
