import Mock from 'mockjs';

// 模拟延迟
Mock.setup({
  timeout: '200-600'
});

// 用户数据
const users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: '123456',
    username: '管理员',
    role: 'admin', // admin/operation/service
    createTime: '2024-01-01 00:00:00'
  },
  {
    id: 2,
    email: 'operation@example.com',
    password: '123456',
    username: '运营专员',
    role: 'operation',
    createTime: '2024-01-02 00:00:00'
  },
  {
    id: 3,
    email: 'service@example.com',
    password: '123456',
    username: '客服',
    role: 'service',
    createTime: '2024-01-03 00:00:00'
  }
];

// 生成订单数据
const generateOrders = () => {
  const orders = [];
  const statuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
  const statusLabels = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  };

  for (let i = 1; i <= 100; i++) {
    orders.push({
      id: Mock.Random.id(),
      orderNo: `ORD${Mock.Random.string('number', 10)}`,
      productName: Mock.Random.pick(['iPhone 15', 'MacBook Pro', 'AirPods Pro', 'iPad Pro', 'Apple Watch', '小米14', '华为Mate60', 'OPPO Find X7']),
      productImage: Mock.Random.image('100x100', Mock.Random.color(), Mock.Random.first()),
      customerName: Mock.Random.cname(),
      amount: Mock.Random.float(100, 10000, 2, 2),
      status: Mock.Random.pick(statuses),
      statusLabel: statusLabels[Mock.Random.pick(statuses)],
      orderTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
    });
  }
  return orders;
};

// 生成商品数据
const generateProducts = () => {
  const products = [];
  const categories = ['手机', '电脑', '平板', '耳机', '手表', '配件'];

  for (let i = 1; i <= 50; i++) {
    products.push({
      id: i,
      name: Mock.Random.pick(['iPhone 15', 'MacBook Pro', 'AirPods Pro', 'iPad Pro', 'Apple Watch', '小米14', '华为Mate60', 'OPPO Find X7']),
      category: Mock.Random.pick(categories),
      price: Mock.Random.float(100, 10000, 2, 2),
      stock: Mock.Random.integer(0, 1000),
      sales: Mock.Random.integer(0, 5000),
      image: Mock.Random.image('200x200', Mock.Random.color(), Mock.Random.first())
    });
  }
  return products;
};

// Mock接口
// 登录
Mock.mock('/api/user/login', 'post', (options) => {
  const { email, password } = JSON.parse(options.body);
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    return {
      code: 200,
      data: {
        token: 'mock_token_' + Date.now(),
        userInfo: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        }
      },
      message: '登录成功'
    };
  }

  return {
    code: 400,
    data: null,
    message: '邮箱或密码错误'
  };
});

// 获取用户信息
Mock.mock('/api/user/info', 'get', () => {
  // 检查是否在浏览器环境
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return {
      code: 200,
      data: {
        id: 1,
        email: 'admin@example.com',
        username: '管理员',
        role: 'admin'
      },
      message: '成功'
    };
  }
  
  const token = localStorage.getItem('token');
  if (!token) {
    return {
      code: 401,
      data: null,
      message: '未登录'
    };
  }

  return {
    code: 200,
    data: {
      id: 1,
      email: 'admin@example.com',
      username: '管理员',
      role: 'admin'
    },
    message: '成功'
  };
});

// 获取订单列表
Mock.mock(/\/api\/orders(\?.*)?$/, 'get', (options) => {
  const orders = generateOrders();
  const url = new URL(options.url, 'http://localhost');
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const keyword = url.searchParams.get('keyword') || '';
  const status = url.searchParams.get('status') || '';

  // 筛选
  let filteredOrders = orders;
  if (keyword) {
    filteredOrders = orders.filter(order => 
      order.orderNo.includes(keyword) || order.customerName.includes(keyword)
    );
  }
  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }

  // 分页
  const total = filteredOrders.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filteredOrders.slice(start, end);

  return {
    code: 200,
    data: {
      list: pageData,
      total,
      page,
      pageSize
    },
    message: '成功'
  };
});

// 删除订单
Mock.mock(/\/api\/orders\/.*$/, 'delete', () => {
  return {
    code: 200,
    data: null,
    message: '删除成功'
  };
});

// 更新订单状态
Mock.mock(/\/api\/orders\/.*\/status/, 'put', () => {
  return {
    code: 200,
    data: null,
    message: '更新成功'
  };
});

// 获取商品列表
Mock.mock(/\/api\/products(\?.*)?$/, 'get', (options) => {
  const products = generateProducts();
  const url = new URL(options.url, 'http://localhost');
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

  const total = products.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageData = products.slice(start, end);

  return {
    code: 200,
    data: {
      list: pageData,
      total,
      page,
      pageSize
    },
    message: '成功'
  };
});

// 新增商品
Mock.mock('/api/products', 'post', () => {
  return {
    code: 200,
    data: null,
    message: '新增成功'
  };
});

// 编辑商品
Mock.mock(/\/api\/products\/.*$/, 'put', () => {
  return {
    code: 200,
    data: null,
    message: '编辑成功'
  };
});

// 删除商品
Mock.mock(/\/api\/products\/.*$/, 'delete', () => {
  return {
    code: 200,
    data: null,
    message: '删除成功'
  };
});

// 获取统计数据
Mock.mock('/api/statistics/core', 'get', () => {
  return {
    code: 200,
    data: {
      totalOrders: Mock.Random.integer(1000, 5000),
      totalSales: Mock.Random.float(100000, 500000, 2, 2),
      totalUsers: Mock.Random.integer(2000, 8000)
    },
    message: '成功'
  };
});

// 获取销售趋势
Mock.mock('/api/statistics/sales-trend', 'get', () => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const data = months.map(() => Mock.Random.float(10, 30, 2, 2));

  return {
    code: 200,
    data: {
      months,
      data
    },
    message: '成功'
  };
});

// 获取商品分类占比
Mock.mock('/api/statistics/category-ratio', 'get', () => {
  return {
    code: 200,
    data: [
      { value: Mock.Random.integer(20, 40), name: '手机' },
      { value: Mock.Random.integer(10, 30), name: '电脑' },
      { value: Mock.Random.integer(10, 25), name: '平板' },
      { value: Mock.Random.integer(5, 15), name: '耳机' },
      { value: Mock.Random.integer(5, 15), name: '手表' },
      { value: Mock.Random.integer(5, 15), name: '配件' }
    ],
    message: '成功'
  };
});

// 获取用户列表
Mock.mock(/\/api\/users(\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost');
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const keyword = url.searchParams.get('keyword') || '';
  const role = url.searchParams.get('role') || '';

  // 筛选
  let filteredUsers = users;
  if (keyword) {
    filteredUsers = users.filter(user =>
      user.username.includes(keyword) || user.email.includes(keyword)
    );
  }
  if (role) {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }

  // 分页
  const total = filteredUsers.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filteredUsers.slice(start, end);

  return {
    code: 200,
    data: {
      list: pageData,
      total,
      page,
      pageSize
    },
    message: '成功'
  };
});

// 新增用户
Mock.mock('/api/users', 'post', (options) => {
  const userData = JSON.parse(options.body);
  const newUser = {
    id: users.length + 1,
    ...userData,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  };
  users.push(newUser);
  return {
    code: 200,
    data: newUser,
    message: '新增成功'
  };
});

// 编辑用户
Mock.mock(/\/api\/users\/\d+$/, 'put', (options) => {
  const userData = JSON.parse(options.body);
  const id = parseInt(options.url.match(/\/api\/users\/(\d+)$/)[1]);
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...userData };
    return {
      code: 200,
      data: users[index],
      message: '编辑成功'
    };
  }
  return {
    code: 404,
    data: null,
    message: '用户不存在'
  };
});

// 删除用户
Mock.mock(/\/api\/users\/\d+$/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\/api\/users\/(\d+)$/)[1]);
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    return {
      code: 200,
      data: null,
      message: '删除成功'
    };
  }
  return {
    code: 404,
    data: null,
    message: '用户不存在'
  };
});

// 获取系统设置
Mock.mock('/api/settings', 'get', () => {
  return {
    code: 200,
    data: {
      siteName: '电商后台管理系统',
      siteDescription: '专业的电商后台管理系统',
      enableRegistration: true,
      enableEmailVerification: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      enableEmailNotifications: true,
      enableSmsNotifications: false
    },
    message: '成功'
  };
});

// 保存系统设置
Mock.mock('/api/settings', 'put', (options) => {
  const settings = JSON.parse(options.body);
  return {
    code: 200,
    data: settings,
    message: '保存成功'
  };
});

export default Mock;