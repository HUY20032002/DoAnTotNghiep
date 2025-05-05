const ProductVariant = require("../model/ProductVariant");

class ProductVariantController {
  // Tạo biến thể sản phẩm mới
  createProductVariant = async (req, res) => {
    try {
      const productVariant = new ProductVariant(req.body);
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
      res.status(200).json(productVariants);
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
      const updatedVariant = await ProductVariant.findByIdAndUpdate(
        req.params.id,
        req.body,
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
      const variant = await ProductVariant.findByIdAndDelete(req.params.id);
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
}
module.exports = new ProductVariantController();
