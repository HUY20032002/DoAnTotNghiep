const User = require("../model/User");
const { mutipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");

class AdminController {
  // [POST] admin/user/manageruser
  manageruser(req, res, next) {
    User.find({
      admin: false,
    })
      .then((users) => {
        res.json({
          users: mutipleMongooseToObject(users),
        });
      })
      .catch(next);
  }

  // [GET] admin/user/edit
  editUser(req, res, next) {
    User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại." });
        }
        res.status(200).json({
          user: mongooseToObject(user),
        });
      })
      .catch(next);
  }

  updateUser(req, res, next) {
    User.updateOne({ _id: req.params.id }, req.body)
      .then((user) => {
        if (user.matchedCount === 0) {
          return res
            .status(404)
            .json({ message: "Không tìm thấy người dùng!" });
        }
        res.status(200).json({ message: "Cập nhật thành công!", user });
      })
      .catch(next);
  }

  // [DELETE] admin/user/delete
  deleteUser(req, res, next) {
    User.delete({ _id: req.params.id })
      .then(() => res.json(req.body))
      .catch(next);
  }
  // [GET] admin/user/ trash_manageruser
  trash_manageruser(req, res, next) {
    User.findDeleted({ admin: false })
      .where("deleted")
      .equals(true)
      .then((users) =>
        res.status(200).json({
          users: mutipleMongooseToObject(users),
        })
      )
      .catch(next);
  }

  // [PATCh] admin/user/restore

  restoreUser(req, res, next) {
    User.restore({ _id: req.params.id })
      .then(() => {
        return User.findById(req.params.id);
      })
      .then((user) => {
        if (user) {
          res.status(200).json(user); // trả JSON user nếu tìm thấy
        } else {
          res.status(404).json({ message: "Người dùng không tồn tại!" });
        }
      })
      .catch((error) => next(error)); // lỗi thì đẩy về middleware
  }

  // [DELETE] admin/user/destroy/:id
  destroyUser(req, res, next) {
    User.findByIdAndDelete(req.params.id)
      .then((deletedUser) => {
        if (deletedUser) {
          res.status(200).json({
            message: "Xóa người dùng thành công!",
            user: deletedUser,
          });
        } else {
          res.status(404).json({ message: "Người dùng không tồn tại!" });
        }
      })
      .catch((error) => next(error));
  }
}
module.exports = new AdminController();
