const mongoose = require("mongoose");

async function DBconnect() {
  try {
    console.log("Đang cố gắng kết nối tới MongoDB...");
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect thành công");
  } catch (error) {
    console.error("Lỗi kết nối MongoDB:", error);
  }
}

module.exports = { DBconnect };
