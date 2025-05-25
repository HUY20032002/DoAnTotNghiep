import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "~/Components/ProductCard";
import Breadcrumb from "~/components/Breadcrumb";
import { useParams } from "react-router-dom";
import { searchProduct } from "../../redux/apiRequest";

function Search() {
  const { keyword } = useParams();
  const productList =
    useSelector((state) => state.products.products?.allProducts) || [];
  const dispatch = useDispatch();
  useEffect(() => {
    if (keyword) {
      searchProduct(dispatch, keyword);
    }
  }, [keyword, dispatch]);
  return (
    <div className="container mx-auto p-4 mt-[64px]">
      <Breadcrumb />
      <h2 className="text-xl font-semibold mb-4">
        Có <span>{productList.length}</span> kết quả tìm kiếm phù hợp
      </h2>
      {productList && productList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productList.map((product, key) => (
            <ProductCard key={key} data={product} heart={false} />
          ))}
        </div>
      ) : (
        <p>Không tìm thấy sản phẩm nào</p>
      )}
    </div>
  );
}

export default Search;
