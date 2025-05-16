import { createSlice } from "@reduxjs/toolkit";

const productVariantSlice = createSlice({
  name: "productVariants",
  initialState: {
    productVariants: {
      allProductVariants: null,
      ProductVariants: null,
      isFetching: false,
      error: false,
      totalPages: 1,
      currentPage: 1,
    },
    msg: "",
  },
  reducers: {
    //  // Products
    getProductVariantsStart: (state) => {
      state.productVariants.isFetching = true;
    },
    getProductVariantsSuccess: (state, action) => {
      state.productVariants.isFetching = false;
      state.productVariants.allProductVariants = action.payload.products;
    },
    getProductVariantsFailed: (state) => {
      state.productVariants.isFetching = false;
      state.productVariants.error = true;
    },
    // Product
    getProductVariantStart: (state) => {
      state.productVariants.isFetching = true;
    },
    getProductVariantSuccess: (state, action) => {
      state.productVariants.isFetching = false;
      state.productVariants.allProductVariants = action.payload.productVariants;
    },
    getProductVariantFailed: (state) => {
      state.productVariants.isFetching = false;
      state.productVariants.error = true;
    },

    // DELETE
    deleteProductVariantStart: (state) => {
      state.productVariants.isFetching = true;
    },
    deleteProductVariantSuccess: (state, action) => {
      state.productVariants.isFetching = false;
      state.msg = action.payload; // Assuming the API response message is in the payload
    },
    deleteProductVariantFaild: (state, action) => {
      state.productVariants.isFetching = false;
      state.productVariants.error = true;
      state.msg = action.payload; // Store error message in the state
    },

    // UPDATE PRODUCt
    updateProductVariantStart: (state) => {
      state.productVariants.isFetching = true;
    },
    updateProductVariantSuccess: (state, action) => {
      state.productVariants.isFetching = false;
      state.msg = action.payload;
    },
    updateProductVariantFailed: (state, action) => {
      state.productVariants.isFetching = false;
      state.productVariants.error = true;
      state.msg = action.payload;
    },

    // RESTORE
    restoreProductVariantStart: (state) => {
      state.productVariants.isFetching = true;
    },
    restoreProductVariantSuccess: (state, action) => {
      state.productVariants.isFetching = false;
      state.msg = action.payload;
      // Có thể update lại danh sách user nếu muốn ở đây!
    },
    restoreProductVariantFailed: (state) => {
      state.productVariants.isFetching = false;
      state.productVariants.error = true;
    },
    // Create
    createVariantStart: (state) => {
      state.productVariants.isFetching = true;
    },
    createVariantSuccess: (state) => {
      state.productVariants.isFetching = false;
      state.productVariants.error = false;
      state.productVariants.success = true;
    },
    createVariantFailed: (state) => {
      state.productVariants.isFetching = false;
      state.productVariants.error = true;
      state.productVariants.success = false;
    },
    getAllProductVariantsSuccess: (state, action) => {
      state.productVariants.isFetching = false;
      state.productVariants.allProductVariants = action.payload.productVariants; // Cập nhật danh sách sản phẩm
      state.productVariants.totalPages = action.payload.totalPages; // Cập nhật tổng số trang
      state.productVariants.currentPage = action.payload.currentPage; // Cập nhật trang hiện tại
    },
  },
});
export const {
  getProductVariantsStart,
  getProductVariantsSuccess,
  getProductVariantsFailed,
  deleteProductVariantStart,
  deleteProductVariantSuccess,
  deleteProductVariantFaild,
  updateProductVariantStart,
  updateProductVariantSuccess,
  updateProductVariantFailed,
  restoreProductVariantStart,
  restoreProductVariantSuccess,
  restoreProductVariantFailed,
  createVariantStart,
  createVariantSuccess,
  createVariantFailed,
  getAllProductVariantsSuccess,
  getProductVariantStart,
  getProductVariantSuccess,
  getProductVariantFailed,
} = productVariantSlice.actions;

export default productVariantSlice.reducer;
