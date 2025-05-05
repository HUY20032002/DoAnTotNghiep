const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const Product = new Scheme(
  {
    name: { type: String, maxLength: 255 },
    price: { type: Number },
    description: { type: String, maxLength: 255 }, // Sửa lại từ String thành Number
    image: { type: String },
    stock: { type: Number }, // Sửa lại từ String thành Number
    type: { type: String, maxLength: 255 },
    category: { type: String, maxLength: 50 },
  },
  {
    timestamps: true,
  }
);

Product.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model("Product", Product);
