// redux/WishlistSlice.js
import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  },
  reducers: {
    addToWishlist: (state, action) => {
      const { productId } = action.payload;
      const existing = state.items.find((item) => item.productId === productId);
      if (!existing) {
        state.items.push(action.payload); // thêm sản phẩm mới vào wishlist
      }
    },
  },
});

export const { addToWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
