import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import productVariantReducer from "./productVariantSlice";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    products: productReducer,
    productVariants: productVariantReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});

export default store;
