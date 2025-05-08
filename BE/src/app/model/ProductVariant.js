const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const ProductVariantSchema = new Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    }, // Liên kết với sản phẩm chính
    size: { type: String, maxLength: 10 }, // Kích thước của sản phẩm (S, M, L, v.v.)
    price: { type: Number }, // Giá của biến thể (nếu khác giá chính)
    stock: { type: Number, default: 0 }, // Số lượng tồn kho của biến thể
    // sku: { type: String, maxLength: 100 }, // Mã sản phẩm biến thể
  },
  {
    timestamps: true,
  }
);

ProductVariantSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("ProductVariant", ProductVariantSchema);
