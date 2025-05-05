const jwt = require("jsonwebtoken");

const MiddlewareController = {
  // verifyToken
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json("Token Het han");
        }
        req.user = user;
        next();
      });
    }
    // } else {
    //   res.status(401).json("Chua dang nhap");
    // }
  },
  verifyTokenAndAdminAuth: (req, res, next) => {
    MiddlewareController.verifyToken(req, res, () => {
      if (req.user.admin) {
        // chỉ admin mới vào được
        next();
      } else {
        res.status(403).json("Bạn không có quyền Admin!");
      }
    });
  },
};
module.exports = MiddlewareController;
