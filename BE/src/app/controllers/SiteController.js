const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const User = require("../model/User"); // Giả sử bạn có model User trong thư mục model
const Product = require("../model/Product");
const Category = require("../model/Categories");
const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../../util/mongoose");
class SiteController {
  // [GET] /news
  getAllProduct(req, res, next) {
    Product.find({})
      .then((products) =>
        res.json({ products: mutipleMongooseToObject(products) })
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
  // [GET] /search

  search(req, res, next) {
    const keyword = req.query.keyword;
    console.log("Từ khóa tìm kiếm: ", keyword);

    // Tìm category có tên khớp với keyword
    Category.find({
      name: { $regex: keyword, $options: "i" },
    })
      .then((categories) => {
        const categoryIds = categories.map((cat) => cat._id);

        // Tìm sản phẩm theo tên hoặc theo category id
        return Product.find({
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { category: { $in: categoryIds } },
          ],
        });
      })
      .then((products) =>
        res.json({ products: mutipleMongooseToObject(products) })
      )
      .catch(next);
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
  // Tìm kiếm sản phẩm theo Slug
  async findSlug(req, res) {
    try {
      const slug = req.params.slug;

      const product = await Product.findOne({ slug });
      if (!product) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }

      return res.json({ products: mongooseToObject(product) });
    } catch (error) {
      console.error("❌ Lỗi server:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: error.message });
    }
  }
}

module.exports = new SiteController();
