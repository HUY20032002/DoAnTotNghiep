const slug = require("mongoose-slug-generator");
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const User = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên không được để trống!"],
      minlength: [3, "Tên tối thiểu 3 ký tự!"],
      maxlength: [50, "Tên không vượt quá 50 ký tự!"],
    },
    email: {
      type: String,
      required: [true, "Email không được để trống!"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ!"],
    },
    password: {
      type: String,
      required: [true, "Mật khẩu không được để trống!"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự!"],
    },
    phone: {
      type: String,
      match: [/^(\+84|0)[0-9]{9,10}$/, "Số điện thoại không hợp lệ!"],
    },
    address: {
      type: String,
      maxlength: [100, "Địa chỉ không vượt quá 100 ký tự!"],
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Thêm plugin
mongoose.plugin(slug);
User.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model("User", User);
