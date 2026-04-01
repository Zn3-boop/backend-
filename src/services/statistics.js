import request from '../utils/request';

export const statisticsService = {
  // 获取核心数据
  getCoreData: () => {
    return request.get('/statistics/core');
  },

  // 获取销售趋势
  getSalesTrend: () => {
    return request.get('/statistics/sales-trend');
  },

  // 获取商品分类占比
  getCategoryRatio: () => {
    return request.get('/statistics/category-ratio');
  }
};
