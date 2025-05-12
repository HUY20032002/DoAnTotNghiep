const ProductVariant = require("../model/ProductVariant");
const { mutipleMongooseToObject } = require("../../util/mongoose");
class ProductVariantController {
  // Tạo biến thể sản phẩm mới
  createProductVariant = async (req, res) => {
    try {
      const { product_id, price, stock, size } = req.body;

      // Kiểm tra nếu size đã tồn tại với product_id
      const existingVariant = await ProductVariant.findOne({
        product_id,
        size: size.trim().toUpperCase(), // chuẩn hóa size (ví dụ: 'm' -> 'M')
      });

      if (existingVariant) {
        return res
          .status(400)
          .json({ error: `Size "${size}" đã tồn tại cho sản phẩm này.` });
      }

      // Tạo mới nếu không trùng size
      const productVariant = new ProductVariant({
        product_id,
        price,
        stock,
        size,
      });

      await productVariant.save();

      res.status(201).json(productVariant);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  // Lấy tất cả biến thể của sản phẩm
  getAllProductVariants = async (req, res) => {
    try {
      const productVariants = await ProductVariant.find({
        product_id: req.params.productId,
      });
      res
        .status(200)
        .json({ products: mutipleMongooseToObject(productVariants) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Lấy thông tin chi tiết của một biến thể sản phẩm
  getProductVariantById = async (req, res) => {
    try {
      const productVariant = await ProductVariant.findById(req.params.id);
      if (!productVariant) {
        return res.status(404).json({ message: "Product variant not found" });
      }
      res.status(200).json(productVariant);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Cập nhật thông tin của biến thể sản phẩm
  updateProductVariant = async (req, res) => {
    try {
      const { product_id, price, stock, size } = req.body;

      const updatedVariant = await ProductVariant.findByIdAndUpdate(
        req.params.id,
        { product_id, price, stock, size },
        { new: true }
      );

      if (!updatedVariant) {
        return res.status(404).json({ message: "Product variant not found" });
      }

      res.status(200).json(updatedVariant);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  // Xóa biến thể sản phẩm (soft delete)
  deleteProductVariant = async (req, res) => {
    try {
      const variant = await ProductVariant.delete({ _id: req.params.id });
      if (!variant) {
        return res.status(404).json({ message: "Product variant not found" });
      }
      res.status(200).json({ message: "Product variant deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Khôi phục biến thể sản phẩm đã xóa mềm
  restoreProductVariant = async (req, res) => {
    try {
      const variant = await ProductVariant.restore({ _id: req.params.id });
      if (!variant) {
        return res.status(404).json({ message: "Product variant not found" });
      }
      res.status(200).json(variant);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  async getAllProductsTrash(req, res, next) {
    try {
      const { id } = req.params; // Lấy id từ tham số URL

      const products = await ProductVariant.findDeleted({ product_id: id })
        .where("deleted")
        .equals(true);
      res.status(200).json({
        products: mutipleMongooseToObject(products), // Chuyển đổi kết quả sang dạng đối tượng
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = new ProductVariantController();
