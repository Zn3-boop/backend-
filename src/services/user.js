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
  }
};
