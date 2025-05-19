const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");
const slugify = require("slugify");

const Product = new Schema(
  {
    name: { type: String, maxLength: 255 },
    slug: { type: String, unique: true },
    price: { type: Number },
    description: { type: String, maxLength: 255 },
    images: [{ type: String }], // mảng các ảnh sản phẩm
    stock: { type: Number },
    type: { type: String, maxLength: 255 },
    category: { type: String, maxLength: 50 },
  },
  {
    timestamps: true,
  }
);

// Tự động tạo slug trước khi lưu
Product.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

Product.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model("Product", Product);
