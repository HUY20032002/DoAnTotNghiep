import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const {
        productId,
        variantId,
        quantity,
        price,
        img,
        name,
        slug,
        size,
        variantStock,
      } = action.payload;

      if (!state.items) {
        state.items = [];
      }

      const existingItem = state.items.find(
        (item) => item.productId === productId && item.variantId === variantId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice += price * quantity;
      } else {
        state.items.push({
          productId,
          variantId,
          quantity,
          unitPrice: price,
          totalPrice: price * quantity,
          img,
          name,
          slug,
          size,
          variantStock,
        });
      }
    },
    removeFromCart: (state, action) => {
      const variantId = action.payload;

      // Xóa sản phẩm có VariantId tương ứng khỏi danh sách yêu thích
      state.items = state.items.filter((item) => item.variantId !== variantId);
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.variantId === action.payload
      );
      if (item && item.quantity < item.variantStock) {
        item.quantity += 1;
        item.totalPrice = item.unitPrice * item.quantity;
      }
    },

    decreaseQuantity: (state, action) => {
      // Tìm id của biến thể sản phẩm
      const item = state.items.find(
        (item) => item.variantId === action.payload
      );
      // Nếu có sản phẩm và số lượng phải lớn hơn 1
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        item.totalPrice = item.unitPrice * item.quantity; // <-- sửa ở đây
      }
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
