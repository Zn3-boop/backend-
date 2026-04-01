// 用户数据结构
export const User = {
  id: Number,
  email: String,
  username: String,
  role: String, // admin/operation/service
  createTime: String
};

// 订单数据结构
export const Order = {
  id: String,
  orderNo: String,
  productName: String,
  productImage: String,
  customerName: String,
  amount: Number,
  status: String, // pending/paid/shipped/completed/cancelled
  statusLabel: String,
  orderTime: String
};

// 商品数据结构
export const Product = {
  id: Number,
  name: String,
  category: String,
  price: Number,
  stock: Number,
  sales: Number,
  image: String
};

// 统计数据结构
export const Statistics = {
  totalOrders: Number,
  totalSales: Number,
  totalUsers: Number
};
