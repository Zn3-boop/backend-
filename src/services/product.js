import request from '../utils/request';

export const productService = {
  // 获取商品列表
  getProductList: (params) => {
    return request.get('/products', { params });
  },

  // 新增商品
  addProduct: (data) => {
    return request.post('/products', data);
  },

  // 编辑商品
  editProduct: (id, data) => {
    return request.put(`/products/${id}`, data);
  },

  // 删除商品
  deleteProduct: (id) => {
    return request.delete(`/products/${id}`);
  }
};
