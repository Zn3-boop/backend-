import request from '../utils/request';

export const settingsService = {
  // 获取系统设置
  getSettings: () => {
    return request.get('/settings');
  },

  // 保存系统设置
  saveSettings: (data) => {
    return request.put('/settings', data);
  }
};
