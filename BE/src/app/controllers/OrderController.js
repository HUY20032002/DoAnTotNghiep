const Order = require("../models/Order");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

// Tạo mã đơn hàng dạng: INV-ABC123DEF
function generateOrderCode() {
  const uuid = uuidv4().replace(/-/g, "");
  const letters = uuid.slice(0, 3).toUpperCase();
  const hexNumbers = uuid.slice(3, 9).toUpperCase();
  return `${letters}${hexNumbers}`;
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
    const userId = req.user.id;
    const { products, paymentStatus } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const totalAmount = products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderCode = await generateUniqueOrderCode(); // ✅ mã đơn hàng duy nhất

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
    res.status(500).json({ message: "Tạo hóa đơn thất bại", error });
  }
};

module.exports = {
  createOrder,
};
