const Product = require("../model/Product");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { mutipleMongooseToObject } = require("../../util/mongoose");

class ProductController {
  // Tạo sản phẩm mới
  async createProduct(req, res) {
    try {
      const { name, price, stock, category, description } = req.body;
      const imageFile = req.files?.image?.[0];
      const hoverFile = req.files?.hoverimage?.[0];
      if (!imageFile || !hoverFile) {
        return res
          .status(400)
          .json({ message: "Vui lòng chọn cả ảnh chính và ảnh hover!" });
      }

      if (!name || !price || !stock || !category || !description) {
        return res
          .status(400)
          .json({ message: "Vui lòng điền đầy đủ thông tin sản phẩm!" });
      }

      const newProduct = new Product({
        name,
        price,
        stock,
        category,
        description,
        image: `/uploads/${imageFile.filename}`,
        hoverimage: `/uploads/${hoverFile.filename}`,
      });

      await newProduct.save();

      res.status(201).json({
        message: "Sản phẩm đã được tạo thành công",
        product: newProduct,
      });
    } catch (err) {
      res.status(500).json({
        message: "Lỗi khi tạo sản phẩm",
        error: err.message,
      });
    }
  }

  // Các phương thức khác không thay đổi
  async getAllProducts(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const keyword = req.query.keyword || "";
    const category = req.query.category || null;
    const skip = (page - 1) * limit;

    // Query tìm kiếm
    const match = {
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    if (category) {
      match.category = category;
    }

    try {
      const aggregatePipeline = [
        { $match: match },
        {
          $lookup: {
            from: "productvariants",
            localField: "_id",
            foreignField: "product_id",
            as: "variants",
          },
        },
        {
          $addFields: {
            stock: { $sum: "$variants.stock" }, // Tính tổng stock
          },
        },
        {
          $project: {
            variants: 0, // Không trả về mảng variants nếu không cần
          },
        },
        { $skip: skip },
        { $limit: limit },
      ];

      const [products, countResult] = await Promise.all([
        Product.aggregate(aggregatePipeline),
        Product.countDocuments(match),
      ]);

      res.status(200).json({
        products,
        totalPages: Math.max(1, Math.ceil(countResult / limit)),
        currentPage: page,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Lấy sản phẩm đã xóa mềm
  async getAllProductsTrash(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const keyword = req.query.keyword || "";
    const category = req.query.category || null;
    const skip = (page - 1) * limit;

    // Tạo query tìm kiếm (bao gồm tên và mô tả)
    const query = {
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    // Nếu có category, thêm điều kiện lọc category
    if (category) {
      query.category = category; // Cần đảm bảo category là ObjectId
    }

    try {
      // Lấy sản phẩm và tổng số sản phẩm cùng lúc (để tính tổng số trang)
      const [products, count] = await Promise.all([
        Product.findDeleted(query)
          .skip(skip)
          .limit(limit)
          .where("deleted")
          .equals(true), // Áp dụng phân trang
        Product.countDocuments(query), // Lấy tổng số sản phẩm theo query
      ]);

      res.status(200).json({
        products: mutipleMongooseToObject(products),
        totalPages: Math.max(1, Math.ceil(count / limit)), // Tính tổng số trang
        currentPage: page,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Lấy thông tin chi tiết một sản phẩm
  async getProductById(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Cập nhật thông tin sản phẩm
  async updateProduct(req, res) {
    try {
      const productId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid Product ID" });
      }

      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      const currentImageRelativePath = existingProduct.image; // VD: "/uploads/old123.jpg"
      const currentHoverImageRelativePath = existingProduct.hoverimage; // Đường dẫn ảnh hover cũ
      const currentImageFullPath = path.join(
        __dirname,
        "../../../",
        currentImageRelativePath
      );
      const currentHoverImageFullPath = path.join(
        __dirname,
        "../../../",
        currentHoverImageRelativePath
      );

      let imagePath = currentImageRelativePath;
      let hoverImagePath = currentHoverImageRelativePath;

      // Nếu có ảnh mới (image)
      if (req.file) {
        imagePath = "/uploads/" + req.file.filename;
        const newImageFullPath = path.join(
          __dirname,
          "../../uploads",
          req.file.filename
        );

        // Xóa ảnh cũ nếu không phải ảnh mặc định
        if (
          currentImageRelativePath &&
          !currentImageRelativePath.includes("default.jpg") &&
          fs.existsSync(currentImageFullPath)
        ) {
          fs.unlink(currentImageFullPath, (err) => {
            if (err) {
              console.error("❌ Không thể xóa ảnh cũ:", err.message);
            } else {
              console.log("✅ Ảnh cũ đã được xóa:", currentImageFullPath);
            }
          });
        }
      }

      // Nếu có ảnh hover mới (hoverimage)
      if (req.files && req.files.hoverimage) {
        hoverImagePath = "/uploads/" + req.files.hoverimage[0].filename;
        const newHoverImageFullPath = path.join(
          __dirname,
          "../../uploads",
          req.files.hoverimage[0].filename
        );

        // Xóa ảnh hover cũ nếu có và không phải ảnh mặc định
        if (
          currentHoverImageRelativePath &&
          !currentHoverImageRelativePath.includes("default.jpg") &&
          fs.existsSync(currentHoverImageFullPath)
        ) {
          fs.unlink(currentHoverImageFullPath, (err) => {
            if (err) {
              console.error("❌ Không thể xóa ảnh hover cũ:", err.message);
            } else {
              console.log(
                "✅ Ảnh hover cũ đã được xóa:",
                currentHoverImageFullPath
              );
            }
          });
        }
      }

      const updateData = {
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description,
        category: req.body.category,
        image: imagePath,
        hoverimage: hoverImagePath, // Cập nhật ảnh hover
      };

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true }
      );

      res.status(200).json(updatedProduct);
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(400).json({ error: err.message });
    }
  }

  // Xóa sản phẩm (soft delete)
  async deleteProduct(req, res, next) {
    try {
      const product = await Product.delete({ _id: req.params.id }); // Soft delete using mongoose-delete
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error); // Pass the error to the next middleware (usually an error handler)
    }
  }

  // Xóa Vĩnh Viễn sản phẩm
  async destroyProduct(req, res) {
    try {
      const productId = req.params.id;

      // Kiểm tra ID hợp lệ
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "ID sản phẩm không hợp lệ!" });
      }

      // Chỉ tìm sản phẩm đã bị xóa mềm
      const productToDelete = await Product.findOneDeleted({ _id: productId });

      if (!productToDelete) {
        return res.status(404).json({
          message: "Sản phẩm không tồn tại hoặc chưa bị xóa mềm!",
        });
      }

      // Kiểm tra và xóa ảnh nếu có
      if (productToDelete.image) {
        const imagePath = path.resolve(
          __dirname,
          "../../../uploads",
          path.basename(productToDelete.image)
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Ảnh đã được xóa:", imagePath);
        } else {
          console.log("Ảnh không tồn tại tại:", imagePath);
        }
      }
      // Kiểm tra và xóa ảnh nếu có
      if (productToDelete.hoverimage) {
        const imagePath = path.resolve(
          __dirname,
          "../../../uploads",
          path.basename(productToDelete.hoverimage)
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Ảnh đã được xóa:", imagePath);
        } else {
          console.log("Ảnh không tồn tại tại:", imagePath);
        }
      }

      // Xóa vĩnh viễn sản phẩm khỏi DB
      const deletedProduct = await Product.deleteOne({ _id: productId });

      return res.status(200).json({
        message: "Sản phẩm đã bị xóa vĩnh viễn!",
        product: deletedProduct,
      });
    } catch (error) {
      console.error("Lỗi xóa vĩnh viễn:", error);
      return res.status(500).json({
        message: "Lỗi khi xóa vĩnh viễn sản phẩm",
        error: error.message,
      });
    }
  }

  // Khôi phục sản phẩm đã xóa mềm
  async restoreProduct(req, res) {
    try {
      const product = await Product.restore({ _id: req.params.id });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res
        .status(200)
        .json({ message: "Product restored successfully", product });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ProductController();
