import React from "react";
import "./Footer.scss";
const Footer = () => {
  return (
    <footer className="text-white ">
      <div className=" container mx-auto px-10 py-6">
        <div className=" grid grid-cols-12 gap-4 px-10 py-6">
          <div className="col-span-3 text-lg">
            <div className="left-col">Địa chỉ: Yên Lãng, Hà Nội</div>
            <div className="left-col">
              Số điện thoại: <a href="tel:0822221992">0822221992</a>
            </div>
            <div className="left-col">
              Email:{" "}
              <a href="mailto:Mixiishop@gmail.com">Mixiishop@gmail.com</a>
            </div>
          </div>
          <div className="col-span-9 ">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4 ">
                Chính sách
                <h3></h3>
                <div className="right-col1">
                  <a href="/">Trang chủ</a>
                </div>
                <div className="right-col1">
                  {" "}
                  <a href="/">Giới thiệu</a>
                </div>
                <div className="right-col1">
                  {" "}
                  <a href="/">Sản Phẩm</a>
                </div>
                <div className="right-col1">
                  <a href="/">Blog</a>{" "}
                </div>
                <div className="right-col1">
                  {" "}
                  <a href="/">Liên Hệ</a>
                </div>
                <div className="right-col1">
                  {" "}
                  <a href="/">Kiểm tra đơn hàng</a>
                </div>
              </div>
              <div className="col-span-4">
                Hỗ trợ khách hàng
                <div className="right-col2">
                  <a href="/">Tìm Kiếm</a>{" "}
                </div>
                <div className="right-col2">
                  <a href="/">Chính sách bảo mật</a>{" "}
                </div>
                <div className="right-col2">
                  {" "}
                  <a href="">Điều Khoản dịch vụ</a>
                </div>
                <div className="right-col2">
                  {" "}
                  <a href="">Hướng dẫn kiểm tra đơn hàng</a>
                </div>
              </div>
              <div className="col-span-4 ">
                Đăng ký nhận tin
                <div className="right-col3">Mail</div>
                <div className="right-col3">
                  <a href="">facebook</a>
                  <a href="">intagram</a>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2 py-2 bg-yellow-400">
              <div className="">Ngân hàng 1</div>
              <div className="">Ngân hàng 2</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
