import React, { useState, useEffect, useRef } from "react";
// import "./Search.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, searchProduct } from "../../redux/apiRequest";
import { toast } from "react-toastify";

function Search({ show, onClose }) {
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((state) => state.auth.login.currentUser);
  const id = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null); // Tạo một ref cho dropdown menu
  const [totalQuanlityCart, SetTotalQuanlityCart] = useState(0);
  const [totalWishList, SetTotalWishList] = useState(0);
  const [searchKey, SetSearchKey] = useState("");
  const carts = useSelector((state) => state.cart.items) || [];
  const wishlist = useSelector((state) => state.wishlist.items) || [];
  // target input search
  const inputRef = useRef(null);
  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);
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
      onClose();
    } catch (error) {
      toast.error("Đăng xuất thất bại");
    }
  };
  //   Show Search
  if (!show) return null;

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };
  const handleCloseShow = () => {
    onClose();
  };
  const handleSearchKey = () => {
    if (!searchKey.trim()) {
      toast.warning("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }
    searchProduct(dispatch, searchKey);
    onClose();
    navigate(`/search/${encodeURIComponent(searchKey)}`);
  };

  return (
    <header
      id="modal-overlay"
      onClick={handleOverlayClick}
      className=" fixed inset-0 z-50  bg-black/50 transition-opacity duration-200">
      <div className="content bg-white">
        <div className="left-content">
          <div className="logo">
            <Link to="/" onClick={onClose}>
              <img src="/logo.webp" alt="logo" />
            </Link>{" "}
          </div>
        </div>
        <div className="center-content flex justify-center items-center w-[730px] px-2 relative">
          <div className="search border border-black p-1 rounded-3xl w-[730px]">
            <input
              ref={inputRef}
              type="text"
              className="w-full rounded-3xl px-1 py-1 focus:outline-none"
              placeholder="Tìm Kiếm...."
              onChange={(e) => SetSearchKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchKey();
                }
              }}
            />
            {/* Nút tìm kiếm nằm bên trong input field, bên phải */}
            <button
              onClick={handleSearchKey}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        <div className="right-content">
          <div className="search">
            <button onClick={handleCloseShow}>
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
                          onClick={onClose}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem">
                          Quản Lý
                        </Link>
                      ) : (
                        <Link
                          to="/profile"
                          onClick={onClose}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem">
                          Profile
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          handleLogout();
                          onClose();
                        }}
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
            onClick={onClose}
            className="favorite rounded-lg flex justify-center items-center relative hover:bg-gray-100">
            <i className="far fa-heart"></i>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-sm w-5 h-5 rounded-full flex justify-center items-center">
              {totalWishList}
            </span>
          </Link>
          <Link
            to={"/carts"}
            onClick={onClose}
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

export default Search;
