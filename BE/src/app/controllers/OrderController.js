const Order = require("../model/Order");
const User = require("../model/User");
const { v4: uuidv4 } = require("uuid");

// Tạo mã đơn hàng dạng: INV-ABC123DEF
function generateOrderCode() {
  const uuid = uuidv4().replace(/-/g, "");
  const letters = uuid.slice(0, 3).toUpperCase();
  const hexNumbers = uuid.slice(3, 9).toUpperCase();
  return `MXI${letters}${hexNumbers}`;
}

// Tạo mã đơn hàng duy nhất
async function generateUniqueOrderCode() {
  let code;
  let exists = true;
  while (exists) {
    code = generateOrderCode();
    exists = await Order.exists({ orderCode: code });
  }
  return code;
}

const createOrder = async (req, res) => {
  try {
    const userId = req.body.user.id;
    const { products, paymentStatus, totalAmount } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    // Tính tổng lại (hoặc dùng tổng từ client)
    // Cách 1:
    // const totalAmountCalc = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Cách 2: dùng totalAmount truyền từ client
    if (typeof totalAmount !== "number" || isNaN(totalAmount)) {
      return res.status(400).json({ message: "Tổng tiền không hợp lệ" });
    }

    const orderCode = await generateUniqueOrderCode();

    const newOrder = new Order({
      orderCode,
      creator: {
        userId: user._id,
        name: user.name,
        address: user.address,
        phone: user.phone,
      },
      products,
      totalAmount,
      paymentStatus,
    });

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("❌ Lỗi createOrder:", error);
    res
      .status(500)
      .json({ message: "Tạo hóa đơn thất bại", error: error.message });
  }
};

module.exports = {
  createOrder,
};
