const Product = require("../model/Product");
const ProductVariant = require("../model/ProductVariant");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { mutipleMongooseToObject } = require("../../util/mongoose");

class ProductController {
  // Tạo sản phẩm mới
  async createProduct(req, res) {
    try {
      const { name, price, stock, category, description } = req.body;
      const imageFiles = req.files;

      if (!imageFiles || imageFiles.length === 0) {
        return res
          .status(400)
          .json({ message: "Vui lòng chọn ít nhất 1 ảnh!" });
      }

      if (!name || !price || !stock || !category || !description) {
        return res
          .status(400)
          .json({ message: "Vui lòng điền đầy đủ thông tin sản phẩm!" });
      }

      const images = imageFiles.map((file) => `/uploads/${file.filename}`);

      const newProduct = new Product({
        name,
        price,
        stock,
        category,
        description,
        images,
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

      const oldImages = existingProduct.images || [];

      let keptImages = [];
      if (req.body.keptImages) {
        try {
          keptImages = JSON.parse(req.body.keptImages);
        } catch (err) {
          return res.status(400).json({ message: "Invalid keptImages format" });
        }
      }

      // Ảnh sẽ bị xóa (cũ mà không giữ)
      const imagesToDelete = oldImages.filter(
        (img) => !keptImages.includes(img)
      );

      // Xóa ảnh khỏi folder
      for (const imgPath of imagesToDelete) {
        if (imgPath && !imgPath.includes("default.jpg")) {
          const fullPath = path.join(__dirname, "../../../", imgPath);
          if (fs.existsSync(fullPath)) {
            try {
              await fs.promises.unlink(fullPath);
              console.log(" Đã xóa ảnh:", fullPath);
            } catch (err) {
              console.error(" Lỗi xóa ảnh:", err.message);
            }
          }
        }
      }

      // Ảnh mới upload
      let newUploadedImages = [];
      if (req.files && req.files.length > 0) {
        newUploadedImages = req.files.map(
          (file) => "/uploads/" + file.filename
        );
      }
      const finalImages = [...keptImages, ...newUploadedImages];
      const updateData = {
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description,
        category: req.body.category,
        images: finalImages,
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

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "ID sản phẩm không hợp lệ!" });
      }

      const productToDelete = await Product.findOneDeleted({ _id: productId });

      if (!productToDelete) {
        return res.status(404).json({
          message: "Sản phẩm không tồn tại hoặc chưa bị xóa mềm!",
        });
      }

      //  Xử lý xóa ảnh trong mảng images
      if (Array.isArray(productToDelete.images)) {
        for (const imgPath of productToDelete.images) {
          const cleanedImgPath = imgPath.replace(/^\/+/, "");
          const fullPath = path.join(__dirname, "../../../", cleanedImgPath);
          if (fs.existsSync(fullPath)) {
            try {
              fs.unlinkSync(fullPath);
              console.log(" Đã xóa ảnh:", fullPath);
            } catch (err) {
              console.error(" Lỗi khi xóa ảnh:", fullPath, err.message);
            }
          } else {
            console.log("Ảnh không tồn tại:", fullPath);
          }
        }
      }

      // 🔁 Xóa tất cả các biến thể liên quan
      await ProductVariant.deleteMany({ product_id: productId });
      // console.log(`🗑️ Đã xóa các biến thể của sản phẩm ${productId}`);

      // Xóa sản phẩm khỏi DB
      const deletedProduct = await Product.deleteOne({ _id: productId });

      return res.status(200).json({
        message: "Sản phẩm, ảnh và các biến thể đã bị xóa vĩnh viễn!",
        product: deletedProduct,
      });
    } catch (error) {
      console.error(" Lỗi khi xóa vĩnh viễn sản phẩm:", error);
      return res.status(500).json({
        message: "Lỗi hệ thống khi xóa sản phẩm",
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
