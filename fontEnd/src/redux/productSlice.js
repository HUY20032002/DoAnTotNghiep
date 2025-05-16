import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "user",
  initialState: {
    products: {
      allProducts: null,
      Product: null,
      isFetching: false,
      error: false,
      totalPages: 1,
      currentPage: 1,
    },
    msg: "",
  },
  reducers: {
    //  // Products
    getProductsStart: (state) => {
      state.products.isFetching = true;
    },
    getProductsSuccess: (state, action) => {
      state.products.isFetching = false;
      state.products.allProducts = action.payload.products;
    },
    getProductsFailed: (state) => {
      state.products.isFetching = false;
      state.products.error = true;
    },
    // Product
    getProductStart: (state) => {
      state.products.isFetching = true;
    },
    getProductSuccess: (state, action) => {
      state.products.isFetching = false;
      state.products.allProducts = action.payload.products;
    },
    getProductFailed: (state) => {
      state.products.isFetching = false;
      state.products.error = true;
    },

    // DELETE
    deleteProductStart: (state) => {
      state.products.isFetching = true;
    },
    deleteProductSuccess: (state, action) => {
      state.products.isFetching = false;
      state.msg = action.payload; // Assuming the API response message is in the payload
    },
    deleteProductFaild: (state, action) => {
      state.products.isFetching = false;
      state.products.error = true;
      state.msg = action.payload; // Store error message in the state
    },

    // UPDATE PRODUCt
    updateProductStart: (state) => {
      state.products.isFetching = true;
    },
    updateProductSuccess: (state, action) => {
      state.products.isFetching = false;
      state.msg = action.payload;
    },
    updateProductFailed: (state, action) => {
      state.products.isFetching = false;
      state.products.error = true;
      state.msg = action.payload;
    },

    // RESTORE
    restoreProductStart: (state) => {
      state.products.isFetching = true;
    },
    restoreProductSuccess: (state, action) => {
      state.products.isFetching = false;
      state.msg = action.payload;
      // Có thể update lại danh sách user nếu muốn ở đây!
    },
    restoreProductFailed: (state) => {
      state.products.isFetching = false;
      state.products.error = true;
    },
    // Create
    createStart: (state) => {
      state.products.isFetching = true;
    },
    createSuccess: (state) => {
      state.products.isFetching = false;
      state.products.error = false;
      state.products.success = true;
    },
    createFailed: (state) => {
      state.products.isFetching = false;
      state.products.error = true;
      state.products.success = false;
    },
    getAllProductsSuccess: (state, action) => {
      state.products.isFetching = false;
      state.products.allProducts = action.payload.products; // Cập nhật danh sách sản phẩm
      state.products.totalPages = action.payload.totalPages; // Cập nhật tổng số trang
      state.products.currentPage = action.payload.currentPage; // Cập nhật trang hiện tại
    },
  },
});
export const {
  getProductsStart,
  getProductsSuccess,
  getProductsFailed,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFaild,
  updateProductStart,
  updateProductSuccess,
  updateProductFailed,
  restoreProductStart,
  restoreProductSuccess,
  restoreProductFailed,
  createStart,
  createSuccess,
  createFailed,
  getAllProductsSuccess,
  getProductStart,
  getProductSuccess,
  getProductFailed,
} = productSlice.actions;

export default productSlice.reducer;
