import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId, variantId, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId && item.variantId === variantId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ productId, variantId, quantity });
      }
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
