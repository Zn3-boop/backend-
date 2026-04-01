import request from '../utils/request';

export const userService = {
  // 登录
  login: (data) => {
    return request.post('/user/login', data);
  },

  // 获取用户信息
  getUserInfo: () => {
    return request.get('/user/info');
  },

  // 退出登录
  logout: () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    }
    return Promise.resolve();
  },

  // 获取用户列表
  getUserList: (params) => {
    return request.get('/users', { params });
  },

  // 新增用户
  addUser: (data) => {
    return request.post('/users', data);
  },

  // 编辑用户
  editUser: (id, data) => {
    return request.put(`/users/${id}`, data);
  },

  // 删除用户
  deleteUser: (id) => {
    return request.delete(`/users/${id}`);
  }
};
