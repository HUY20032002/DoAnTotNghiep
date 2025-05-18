import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import productVariantReducer from "./productVariantSlice";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";

// 1. Hàm này dùng để lấy dữ liệu wishlist từ sessionStorage khi khởi tạo store Redux
const loadWishlistFromSession = () => {
  try {
    // Lấy chuỗi JSON được lưu dưới key "wishlist" trong sessionStorage
    const serialized = sessionStorage.getItem("wishlist");

    // Nếu có dữ liệu thì parse chuỗi JSON thành object JS, còn không thì trả về mặc định là { items: [] }
    return serialized ? JSON.parse(serialized) : { items: [] };
  } catch {
    // Nếu xảy ra lỗi (vd: dữ liệu không hợp lệ), trả về mặc định là { items: [] }
    return { items: [] };
  }
};

// 2. Hàm này dùng để lưu state wishlist vào sessionStorage dưới dạng chuỗi JSON
const saveWishlistToSession = (wishlistState) => {
  try {
    // Chuyển đổi object wishlistState thành chuỗi JSON
    const serialized = JSON.stringify(wishlistState);

    // Lưu chuỗi JSON đó vào sessionStorage với key "wishlist"
    sessionStorage.setItem("wishlist", serialized);
  } catch {
    // Nếu lỗi khi lưu, bỏ qua để tránh làm đứt app
  }
};

// 3. Khởi tạo trạng thái ban đầu (preloadedState) cho Redux store
const preloadedState = {
  wishlist: loadWishlistFromSession(), // Lấy dữ liệu wishlist từ sessionStorage, hoặc dùng mặc định nếu không có
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    products: productReducer,
    productVariants: productVariantReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  preloadedState,
});

// Theo dõi thay đổi để lưu lại wishlist
store.subscribe(() => {
  saveWishlistToSession(store.getState().wishlist);
});

export default store;
