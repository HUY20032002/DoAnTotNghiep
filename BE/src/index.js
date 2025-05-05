const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const hbs = require("express-handlebars");
const app = express();
const port = 8000;
const route = require("./routes");
const db = require("./config/db");
const methodOverride = require("method-override");
const session = require("express-session");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
// Connect DB
db.DBconnect();
// Cấu hình CORS để cho phép yêu cầu từ domain khác
app.use(
  cors({
    origin: "http://localhost:5173", // Đảm bảo frontend có thể truy cập backend
    credentials: true, // Cho phép gửi cookies
  })
);
// truy cập vào ảnh đã uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Middleware
app.use(morgan("dev")); // Ghi log HTTP
app.use(express.json()); // Đọc JSON
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true })); // Đọc form
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
// Gán user vào res.locals để dùng trong view
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});
app.use(cookieParser());
// Template engine
app.engine(
  "hbs",
  hbs.engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
route(app);

// Start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
