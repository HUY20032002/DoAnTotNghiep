import React, { useState, useEffect, useRef } from "react";
import "./Header.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/apiRequest";
import { toast } from "react-toastify";
import SearchModal from "~/Modals/Search";
function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((state) => state.auth.login.currentUser);
  const id = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null); // Tạo một ref cho dropdown menu
  const [totalQuanlityCart, SetTotalQuanlityCart] = useState(0);
  const [totalWishList, SetTotalWishList] = useState(0);
  const [showModals, setShowModals] = useState(false);

  const carts = useSelector((state) => state.cart.items) || [];
  const wishlist = useSelector((state) => state.wishlist.items) || [];
  // Cart
  useEffect(() => {
    let total = 0;
    if (Array.isArray(carts)) {
      carts.forEach((item) => {
        total += item.quantity;
      });
    }
    SetTotalQuanlityCart(total);
  }, [carts]);

  // WishList
  useEffect(() => {
    SetTotalWishList(Array.isArray(wishlist) ? wishlist.length : 0);
  }, [wishlist]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    // Cleanup listener khi component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  // Định nghĩa hàm handleLogout
  const handleLogout = () => {
    try {
      logoutUser(dispatch, id, navigate); // Xử lý logout
      toast.success("Đăng xuất thành công");
    } catch (error) {
      toast.error("Đăng xuất thất bại");
    }
  };
  return (
    <header className="header fixed top-0 left-0 right-0 z-60 bg-white shadow-md">
      <SearchModal show={showModals} onClose={() => setShowModals(false)} />
      <div className="content">
        <div className="left-content">
          <div className="logo">
            <Link to="/">
              {" "}
              <img src="/logo.webp" alt="logo" />
            </Link>{" "}
          </div>
        </div>
        <div className="center-content">
          <div className="child-center-content">
            <Link to="/">
              {" "}
              <span>Trang chủ</span>
            </Link>{" "}
          </div>
          <div className="child-center-content">
            <span>Giới thiệu</span>
          </div>
          <div className="child-center-content">
            <span>
              <img src="https://theme.hstatic.net/200000881795/1001243022/14/menu_icon_3.png?v=152" />
              Sản phẩm
              <i className="fas fa-chevron-down"></i>
            </span>
          </div>
          <div className="child-center-content">
            <span>Blog</span>
          </div>
          <div className="child-center-content">
            <span>Liên Hệ</span>
          </div>
          <div className="child-center-content">
            <span>Kiểm tra đơn hàng</span>
          </div>
        </div>
        <div className="right-content">
          <div className="search">
            <button onClick={() => setShowModals(!showModals)}>
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="relative text-left " ref={menuRef}>
            <div className="rounded-lg  hover:bg-gray-100">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="inline-flex w-full justify-center  px-3 py-2  font-semibold ring-inset "
                id="menu-button"
                aria-expanded={showMenu ? "true" : "false"}
                aria-haspopup="true">
                <i className="far fa-user"></i>
              </button>
            </div>

            {showMenu && (
              <div
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1">
                <div className="py-1" role="none">
                  <div
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem">
                    {user?.name || "Người dùng"}
                  </div>
                  {!user ? (
                    // Nếu chưa đăng nhập, hiện Đăng nhập/Đăng ký
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700"
                        role="menuitem">
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-gray-700"
                        role="menuitem">
                        Đăng ký
                      </Link>
                    </>
                  ) : (
                    // Nếu đã đăng nhập
                    <>
                      {user.admin ? (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem">
                          Quản Lý
                        </Link>
                      ) : (
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem">
                          Profile
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem">
                        Đăng xuất
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link
            to={"/wishlist"}
            className="favorite rounded-lg flex justify-center items-center relative hover:bg-gray-100">
            <i className="far fa-heart"></i>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-sm w-5 h-5 rounded-full flex justify-center items-center">
              {totalWishList}
            </span>
          </Link>
          <Link
            to={"/carts"}
            className="cart rounded-lg  flex justify-center items-center relative hover:bg-gray-100 ">
            <i className="fas fa-cart-plus"></i>
            <span className="absolute -top-2 -right-1 bg-red-500 text-white text-sm w-5 h-5 rounded-full flex justify-center items-center">
              {totalQuanlityCart}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
