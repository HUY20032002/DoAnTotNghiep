import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [], // Danh sách sản phẩm yêu thích
  },
  reducers: {
    addToWishlist: (state, action) => {
      const { productId } = action.payload;

      // Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa
      const existing = state.items.find((item) => item.productId === productId);

      // Nếu chưa có thì thêm sản phẩm vào danh sách
      if (!existing) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;

      // Xóa sản phẩm có productId tương ứng khỏi danh sách yêu thích
      state.items = state.items.filter((item) => item.productId !== productId);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
