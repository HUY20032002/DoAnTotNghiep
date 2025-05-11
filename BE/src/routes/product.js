const express = require("express");
const router = express.Router();
const productController = require("../app/controllers/ProductController");
const multer = require("multer");
const path = require("path");

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// 👇 Sửa route createProduct để dùng multer
router.post("/create", upload.single("image"), productController.createProduct);

// Lấy tất cả sản phẩm
router.get("/", productController.getAllProducts);

//Lấy tất cả sản phẩm xóa mềm
router.get("/trash", productController.getAllProductsTrash);

// Lấy thông tin chi tiết một sản phẩm
router.get("/:id", productController.getProductById);

// Cập nhật thông tin sản phẩm
router.put("/:id", upload.single("image"), productController.updateProduct);

// Xóa sản phẩm (soft delete)
router.delete("/:id", productController.deleteProduct);

// Khôi phục sản phẩm đã xóa mềm
router.patch("/restore/:id", productController.restoreProduct);
// Xóa Vĩnh Viễn sản phẩm
router.delete("/destroy/:id", productController.destroyProduct);

module.exports = router;
