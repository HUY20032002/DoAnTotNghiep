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
// 1 Tạo hàm load cart từ session Storage
const loadCartFromSession = () => {
  try {
    const serialized = sessionStorage.getItem("cart");
    return serialized ? JSON.parse(serialized) : { items: [] };
  } catch {
    return { items: [] };
  }
};
// 2 Tạo hàm lưu cart vào sessionStorage
const saveCartToSession = (cartState) => {
  try {
    const serialized = JSON.stringify(cartState);
    sessionStorage.setItem("cart", serialized);
  } catch {}
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
  wishlist: loadWishlistFromSession(),
  cart: loadCartFromSession(), // <-- Thêm dòng này
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
  const state = store.getState();
  saveWishlistToSession(store.getState().wishlist);
  saveCartToSession(state.cart);
});

export default store;
