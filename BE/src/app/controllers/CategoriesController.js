const Categories = require("../model/Categories");
class CategoriesController {
  //  [POST] /categories/
  async store(req, res, next) {
    const categories = new Categories(req.body);

    try {
      await categories.save();
      res.status(200).json("Thành công:", req.body);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  //   [GET] /categories/all
  async show(req, res, next) {
    try {
      const categories = await Categories.find();
      res.status(200).json({
        message: "Thành công",
        data: categories,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new CategoriesController();
