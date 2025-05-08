const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // Không cần lưu file => dùng bộ nhớ tạm
const ProductVariantController = require("../app/controllers/ProductVariantController");

// Tạo biến thể sản phẩm mới
router.post(
  "/create",
  upload.none(),
  ProductVariantController.createProductVariant
);
// Lấy tất cả biến thể của sản phẩm (theo product_id)
router.get("/:productId", ProductVariantController.getAllProductVariants);

// Lấy thông tin chi tiết của một biến thể sản phẩm
router.get("/:id", ProductVariantController.getProductVariantById);

// Cập nhật thông tin của biến thể sản phẩm
router.put("/:id", ProductVariantController.updateProductVariant);

// Xóa biến thể sản phẩm (soft delete)
router.delete("/:id", ProductVariantController.deleteProductVariant);

// Khôi phục biến thể sản phẩm đã xóa mềm
router.put("/restore/:id", ProductVariantController.restoreProductVariant);

module.exports = router;
