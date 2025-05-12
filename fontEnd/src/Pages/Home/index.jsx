import React from "react";
import ProductCard from "~/Components/ProductCard";

const Home = () => {
  const products = [
    {
      id: 1,
      name: "Limited Edition Sports Trainer",
      price: 189.99,
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
      hoverImage:
        "https://images.unsplash.com/photo-1523381140794-a1eef18a37c7",
    },
    {
      id: 2,
      name: "Classic White Sneakers",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1618354691218-76d606c445f4",
      hoverImage:
        "https://images.unsplash.com/photo-1622473591867-53f2d0b2a5de",
    },
    // Thêm bao nhiêu tùy bạn
  ];

  return (
    <div className="container mx-auto p-4 mt-[64px]">
      <h2 className="text-2xl font-semibold mb-6">Sản phẩm nổi bật</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            hoverImage={product.hoverImage}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
