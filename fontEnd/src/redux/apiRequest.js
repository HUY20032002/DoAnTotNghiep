import axios from "axios";
import {
  loginStart,
  loginFailed,
  loginSuccess,
  registerFailed,
  registerSuccess,
  registerStart,
  logoutStart,
  logoutSuccess,
  logoutFailed,
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailed,
} from "./authSlice";
import {
  getUsersFailed,
  getUsersStart,
  getUsersSuccess,
  DeleteUserFaild,
  DeleteUserStart,
  DeleteUserSuccess,
  updateUserStart,
  updateUserSuccess,
  updateUserFailed,
  restoreUserStart,
  restoreUserSuccess,
  restoreUserFailed,
} from "./userSlice";
import {
  getProductsStart,
  getProductsSuccess,
  getProductsFailed,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFaild,
  restoreProductSuccess,
  restoreProductStart,
  restoreProductFailed,
  createStart,
  createSuccess,
  createFailed,
  getAllProductsSuccess,
  getProductStart,
  getProductSuccess,
  getProductFailed,
} from "./productSlice";
import {
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
} from "./productVariantSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// LOGIN
export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("http://localhost:8000/user/login", user);
    dispatch(loginSuccess(res.data));
    localStorage.setItem("user", JSON.stringify(res.data)); // lưu thông tin user vào localStorage
    navigate("/"); // chuyển hướng sau khi đăng nhập thành công
  } catch (error) {
    dispatch(loginFailed());
  }
};
// Register
export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post("http://localhost:8000/user/register", user);
    dispatch(registerSuccess());
  } catch (error) {
    dispatch(registerFailed());
  }
};
// Logout
export const logoutUser = async (dispatch, id, navigate) => {
  dispatch(logoutStart());
  try {
    localStorage.removeItem("user");

    dispatch(logoutSuccess());
    navigate("/"); // Redirect to login after logout
  } catch (error) {
    console.error("Logout failed:", error);
    if (error.response && error.response.status === 403) {
      console.warn("Token expired - removing local and logging out");
      dispatch(logoutSuccess());
      localStorage.removeItem("user");
      navigate("/login");
    } else {
      dispatch(logoutFailed());
      console.error("Logout failed with status:", error.response.status);
    }
  }
};
// forgotPassword
export const forgotPassword = async (dispatch, user, navigate) => {
  dispatch(forgotPasswordStart());

  try {
    // Gửi yêu cầu API để xử lý quên mật khẩu
    await axios.post("http://localhost:8000/forgotpassword", user);

    // Nếu yêu cầu thành công, dispatch success và điều hướng đến login
    dispatch(forgotPasswordSuccess());
    navigate("/login");
  } catch (error) {
    // Xử lý lỗi nếu API trả về lỗi
    dispatch(forgotPasswordFailed()); // Lỗi khi quên mật khẩu không thành công
    console.error("Forgot Password failed:", error);
  }
};
// GET ALL USER
export const getAllUsers = async (
  token,
  dispatch,
  page = 1,
  keyword = "",
  setTotalPages
) => {
  dispatch(getUsersStart());
  try {
    const res = await axios.get(
      `http://localhost:8000/admin/user/manageruser?page=${page}&limit=5&keyword=${keyword}`,
      {
        headers: { token: `Bearer ${token}` },
      }
    );
    dispatch(getUsersSuccess({ users: res.data.users }));
    if (setTotalPages) setTotalPages(res.data.totalPages); // Cập nhật tổng số trang
  } catch (err) {
    dispatch(getUsersFailed());
    console.error("Lỗi lấy danh sách người dùng:", err);
  }
};
// GET TRASH USER
export const getTrashAllUsers = async (
  token,
  dispatch,
  page = 1,
  keyword = "",
  setTotalPages
) => {
  dispatch(getUsersStart());
  try {
    const res = await axios.get(
      `http://localhost:8000/admin/user/trash-manageruser?page=${page}&limit=5&keyword=${keyword}`,
      {
        headers: { token: `Bearer ${token}` },
      }
    );
    dispatch(getUsersSuccess({ users: res.data.users }));
    if (setTotalPages) {
      const pages = Math.max(1, res.data.totalPages); // Luôn có ít nhất 1 trang
      setTotalPages(pages);
    }
  } catch (err) {
    dispatch(getUsersFailed());
    console.error("Lỗi lấy danh sách người dùng:", err);
  }
};
// SORT DELETE
export const SortDelete = async (dispatch, id, accessToken) => {
  dispatch(DeleteUserStart());
  try {
    const res = await axios.delete(
      "http://localhost:8000/admin/user/" + id + "?_method=DELETE",
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    dispatch(DeleteUserSuccess(res.data));
  } catch (error) {
    dispatch(DeleteUserFaild());
    console.error("Delete failed:", error);
  }
};
// DELETE
export const DestroyUser = async (dispatch, id, accessToken) => {
  dispatch(DeleteUserStart());
  try {
    const res = await axios.delete(
      "http://localhost:8000/admin/user/" + id + "/destroy?_method=DELETE",
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    dispatch(DeleteUserSuccess(res.data));
  } catch (error) {
    dispatch(DeleteUserFaild());
    console.error("Delete failed:", error);
  }
};
// Restore
export const restoreUser = async (dispatch, id, accessToken) => {
  dispatch(restoreUserStart());
  try {
    const res = await axios.patch(
      "http://localhost:8000/admin/user/" + id + "/restore",
      null,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    dispatch(restoreUserSuccess(res.data));
  } catch (error) {
    dispatch(restoreUserFailed());
    console.error("Restore failed:", error);
  }
};
// Update User
export const UpdateUser = async (dispatch, id, data, accessToken) => {
  dispatch(updateUserStart());
  try {
    const res = await axios.put(
      "http://localhost:8000/admin/user/" + id,
      data,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    dispatch(updateUserSuccess(res.data));
  } catch (error) {
    dispatch(updateUserFailed());
    console.error("Update failed:", error);
  }
};
// GET ALL PRODUCT
export const getAllProducts = async (
  dispatch,
  token,
  page = 1,
  keyword = "",
  category = ""
) => {
  try {
    const categoryParam = category ? `&category=${category}` : "";
    const res = await axios.get(
      `http://localhost:8000/product/?page=${page}&limit=5&keyword=${keyword}${categoryParam}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // Log dữ liệu trả về
    // console.log(res.data);
    // Cập nhật Redux state với dữ liệu sản phẩm
    dispatch(getAllProductsSuccess(res.data));
  } catch (err) {
    console.error("Fetch products error:", err);
  }
};
// GET ALL Trash PRODUCT
export const getTrashAllProducts = async (
  dispatch,
  token,
  page = 1,
  keyword = "",
  category = ""
) => {
  try {
    const categoryParam = category ? `&category=${category}` : "";
    const res = await axios.get(
      `http://localhost:8000/product/trash?page=${page}&limit=5&keyword=${keyword}${categoryParam}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // Log dữ liệu trả về
    console.log(res.data);
    // Cập nhật Redux state với dữ liệu sản phẩm
    dispatch(getAllProductsSuccess(res.data));
  } catch (err) {
    console.error("Fetch products error:", err);
  }
};
// CreateProduct
export const createProduct = async (dispatch, formData) => {
  dispatch(createStart());
  try {
    await axios.post("http://localhost:8000/product/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(createSuccess()); // Giải quyết res.data thay vì chỉ gọi dispatch
  } catch (error) {
    dispatch(createFailed());
    console.error("Create Product failed:", error);
  }
};
// SORT DELETE PRODUCT
export const SortDeleteProduct = async (dispatch, id, accessToken) => {
  dispatch(deleteProductStart()); // Dispatching delete start action
  try {
    const res = await axios.delete(
      `http://localhost:8000/product/${id}?_method=DELETE`, // Correct URL
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    // Assuming res.data contains a success message or data
    dispatch(deleteProductSuccess(res.data)); // Dispatch success action
  } catch (error) {
    // Dispatch failure action, passing the error message
    dispatch(
      deleteProductFaild(error.response ? error.response.data : "Delete failed")
    );
    console.error("Delete failed:", error);
  }
};
// Restore Product
export const restoreProduct = async (dispatch, id, accessToken) => {
  dispatch(restoreProductStart());
  try {
    const res = await axios.patch(
      "http://localhost:8000/product/restore/" + id,
      null,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    dispatch(restoreProductSuccess(res.data));
  } catch (error) {
    dispatch(restoreProductFailed());
    console.error("Restore failed:", error);
  }
};
// DELETE Product
export const destroyProduct = async (dispatch, id, accessToken) => {
  dispatch(deleteProductStart());
  try {
    const res = await axios.delete(
      "http://localhost:8000/product/destroy/" + id,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    dispatch(deleteProductSuccess(res.data));
  } catch (error) {
    dispatch(deleteProductFaild());
    console.error("Delete failed:", error);
  }
};
// Update Product
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(
      `http://localhost:8000/product/${productId}`,
      productData
    );
    console.log(response.data);
  } catch (error) {
    console.error("Error updating product:", error.response?.data);
  }
};
// Categories Product
export const Categories = async () => {
  try {
    const res = await axios.get("http://localhost:8000/categories/all");
    return res.data; // chỉ trả data
  } catch (error) {
    console.error("Error fetching categories:", error.response?.data || error);
    throw error;
  }
};
// create ProductVariant
export const createProductVariant = async (dispatch, formData) => {
  dispatch(createVariantStart());
  try {
    const res = await axios.post(
      "http://localhost:8000/productvariant/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch(createVariantSuccess());
    return { success: true, data: res.data };
  } catch (error) {
    dispatch(createVariantFailed());
    console.error("Create Product failed:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Đã xảy ra lỗi khi tạo biến thể.",
    };
  }
};
// get ProductVariant
export const getProductVariant = async (dispatch, productId) => {
  dispatch(getProductVariantsStart());
  try {
    const res = await axios.get(
      `http://localhost:8000/productvariant/${productId}`
    );
    console.log(res.data);
    dispatch(getProductVariantsSuccess(res.data)); // Truyền đúng dữ liệu cho Redux
    return res.data; // Optional: Nếu muốn gọi từ component
  } catch (error) {
    dispatch(getProductVariantsFailed());
    console.error("Get ProductVariant failed:", error);
  }
};
// update ProductVariant
export const updateProductVariant = async (dispatch, formData, id) => {
  try {
    dispatch(updateProductVariantStart());
    const res = await axios.put(
      `http://localhost:8000/productvariant/update/${id}`,
      formData
    );
    dispatch(updateProductVariantSuccess());

    // Xử lý khi yêu cầu thành công
  } catch (error) {
    // Xử lý khi yêu cầu thất bại
    dispatch(updateProductVariantFailed());
    console.error("Update Product failed:", error);
  }
};
// delete ProductVariant
export const deleteProductVariant = async (dispatch, id) => {
  try {
    dispatch(deleteProductVariantStart());
    const res = await axios.delete(
      `http://localhost:8000/productvariant/${id}`
    );
    // Xử lý khi yêu cầu thành công
    dispatch(deleteProductVariantSuccess());
  } catch (error) {
    // Xử lý khi yêu cầu thất bại
    dispatch(deleteProductVariantFaild());
    console.error("Delete Product failed:", error);
  }
};
// GET ALL Trash PRODUCT Variant
export const getTrashProductVariant = async (dispatch, productId) => {
  dispatch(getProductVariantsStart());
  try {
    const res = await axios.get(
      `http://localhost:8000/productvariant/trash/${productId}`
    );
    dispatch(getProductVariantsSuccess(res.data)); // Truyền đúng dữ liệu cho Redux
    return res.data; // Optional: Nếu muốn gọi từ component
  } catch (error) {
    dispatch(getProductVariantsFailed());
    console.error("Get ProductVariant failed:", error);
  }
};
// Restore Product Variant
export const restoreProductVariant = async (dispatch, id) => {
  dispatch(restoreProductVariantStart());
  try {
    const res = await axios.patch(
      `http://localhost:8000/productvariant/restore/${id}`
    );
    dispatch(restoreProductVariantSuccess(res.data));
  } catch (error) {
    dispatch(restoreProductVariantFailed());
    console.error("Restore failed:", error);
  }
};
// Home show product
export const ShowProduct = async (dispatch) => {
  dispatch(getProductsStart());
  try {
    const res = await axios.get(`http://localhost:8000/show`);
    dispatch(getProductsSuccess(res.data));
  } catch (error) {
    dispatch(getProductsFailed());
    console.error("Restore failed:", error);
  }
};
// Detail Slug
export const ShowDetail = async (dispatch, slug) => {
  dispatch(getProductStart());
  try {
    const res = await axios.get(`http://localhost:8000/detail/${slug}`);
    dispatch(getProductSuccess(res.data));
    // console.log(res.data.products);
  } catch (error) {
    dispatch(getProductFailed());
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
  }
};
//Create Order
export const createOrder = async (dispatch, data) => {
  // dispatch(getProductStart());
  try {
    const res = await axios.post(`http://localhost:8000/order/create`, data);
    // dispatch(getProductSuccess(res.data));
    // console.log(res.data.products);
  } catch (error) {
    // dispatch(getProductFailed());
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
  }
};
// Search Site
export const searchProduct = async (dispatch, keysearch) => {
  try {
    dispatch(getProductStart());
    const res = await axios.get(
      `http://localhost:8000/search?keyword=${keysearch}`,
      {}
    );
    console.log(res.data);
    dispatch(getProductSuccess(res.data));
  } catch (error) {
    dispatch(getProductFailed());
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
  }
};
