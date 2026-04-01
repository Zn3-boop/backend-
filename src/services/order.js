import request from '../utils/request';

export const orderService = {
  // 获取订单列表
  getOrderList: (params) => {
    return request.get('/orders', { params });
  },

  // 删除订单
  deleteOrder: (id) => {
    return request.delete(`/orders/${id}`);
  },

  // 更新订单状态
  updateOrderStatus: (id, status) => {
    return request.put(`/orders/${id}/status`, { status });
  }
};
