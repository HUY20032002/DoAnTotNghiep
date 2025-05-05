const SiteRouter = require("./site");
const ProductRouter = require("./product");
const AdminRouter = require("./admin");
const AuthRouter = require("./auth");
const ProductVariantRouter = require("./productvariant");
const CategoriesRouter = require("./categories");

function route(app) {
  // acction---> Dispatcher
  app.use("/product", ProductRouter);
  app.use("/productvariant", ProductVariantRouter);
  app.use("/admin", AdminRouter);
  app.use("/user", AuthRouter);
  app.use("/categories", CategoriesRouter);
  app.use("/", SiteRouter);
}

module.exports = route;
