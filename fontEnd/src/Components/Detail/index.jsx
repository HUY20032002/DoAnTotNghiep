import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ShowDetail, Categories } from "~/redux/apiRequest";

const Detail = () => {
  const { slug } = useParams();

  const dispatch = useDispatch();

  const [category, setCategory] = useState([]);
  const detail = useSelector((state) => state.products.products?.allProducts);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cat = await Categories();
        setCategory(cat.data);
        const data = await ShowDetail(dispatch, slug); // gọi API
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      }
    };

    if (slug) fetchData();
  }, [slug, dispatch]);
  const getCategoryName = (catId) => {
    if (category && category.length > 0) {
      const match = category.find((item) => item._id === catId);
      return match ? match.name : "Không tìm thấy danh mục";
    } else {
      return "Mảng category rỗng hoặc chưa có dữ liệu.";
    }
  };

  return (
    <div className="container  p-4 mt-[64px]">
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
        </div>
      ) : (
        <p>Đang tải chi tiết sản phẩm...</p>
      )}
    </div>
  );
};

export default Detail;
