import React, { useState, useEffect, useRef } from "react";
import "./Header.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/apiRequest";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((state) => state.auth.login.currentUser);
  const id = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null); // Tạo một ref cho dropdown menu

  // Kiểm tra và điều hướng khi người dùng đăng nhập

  // Định nghĩa hàm handleLogout
  const handleLogout = () => {
    logoutUser(dispatch, id, navigate); // Xử lý logout
  };

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

  return (
    <header className="container">
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
            <i className="fas fa-search"></i>
          </div>
          <div className="relative text-left" ref={menuRef}>
            <div>
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold ring-inset hover:bg-gray-50"
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

          <div className="favorite">
            <i className="far fa-heart"></i>
          </div>

          <div className="cart">
            <i className="fas fa-cart-plus"></i>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
