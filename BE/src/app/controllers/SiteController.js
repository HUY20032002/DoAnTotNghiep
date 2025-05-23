const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const User = require("../model/User"); // Giả sử bạn có model User trong thư mục model
const Product = require("../model/Product");
class SiteController {
  // [GET] /news
  index(req, res, next) {
    Product.find({})
      .then((products) =>
        res.json("home", { products: mutipleMongooseToObject(products) })
      )
      .catch(next);
  }

  // [GET] /news/:slug
  register(req, res) {
    res.render("register");
  }

  // [GET] /news/:slug
  login(req, res) {
    res.render("login");
  }

  // [GET] /news/:slug
  search(req, res) {
    res.render("home");
  }

  // [POST] /forgot-password
  async forgotPassword(req, res) {
    const { email, newPassword, confirmPassword } = req.body;

    // Kiểm tra nếu mật khẩu mới và mật khẩu xác nhận trùng khớp
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Mật khẩu xác nhận không trùng khớp" });
    }

    // Kiểm tra độ dài mật khẩu
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    try {
      // Tìm người dùng theo email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Email không tồn tại" });
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu cho người dùng
      user.password = hashedPassword;
      await user.save();

      return res
        .status(200)
        .json({ message: "Mật khẩu đã được cập nhật thành công" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
    }
  }
}

module.exports = new SiteController();
