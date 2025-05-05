// models/Product.js
const mongoose = require("mongoose");

const ImgSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }, // URL của ảnh
});

module.exports = mongoose.model("Img", ImgSchema);
