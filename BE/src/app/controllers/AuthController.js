const User = require("../model/User");
const { mongooseToObject } = require("../../util/mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// TODO: Replace with Redis or DB in production
let refreshTokens = [];

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, phone, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã tồn tại!" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email,
        phone,
        address: ",Việt Nam",
        admin: false,
        password: hashedPassword,
      });

      const savedUser = await user.save();
      return res.status(201).json({
        message: "Đăng ký thành công!",
        user: savedUser,
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((el) => el.message);
        return res.status(400).json({ status: "fail", errors });
      }
      next(err);
    }
  }

  generateAccessToken(user) {
    return jwt.sign(
      { id: user._id, admin: user.admin },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "15d" } // Gợi ý rút ngắn thời gian
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { id: user._id, admin: user.admin },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "20s" } // Rút ngắn cho an toàn hơn
    );
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email và mật khẩu là bắt buộc" });
      }

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "Sai Email" });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res.status(401).json({ message: "Sai Mật Khẩu" });

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // ❌ Không lưu refreshToken vào DB
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      const { password: pw, ...userInfo } = user._doc;
      res.status(200).json({ ...userInfo, accessToken, refreshToken });
      // gửi cả refreshToken về FE nếu cần tự quản lý
    } catch (err) {
      res.status(500).json({ message: "Lỗi đăng nhập", error: err.message });
    }
  }

  async RequestrefreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("Bạn chưa đăng nhập");

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err)
        return res.status(403).json("Refresh Token không hợp lệ hoặc hết hạn");

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      res.status(200).json({ accessToken: newAccessToken });
    });
  }

  // In your backend logout route
  async logout(req, res) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Đăng xuất thành công" });
  }

  edit(req, res, next) {
    User.findById(req.params.id)
      .then((user) =>
        res.render("user/edit", {
          user: mongooseToObject(user),
        })
      )
      .catch((err) => next(err));
  }

  update(req, res, next) {
    User.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/"))
      .catch(next);
  }
}

module.exports = new AuthController();
