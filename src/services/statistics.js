import request from '../utils/request';

export const statisticsService = {
  // 获取所有统计数据
  getStatistics: async () => {
    const coreData = await request.get('/statistics/core');
    const salesTrend = await request.get('/statistics/sales-trend');
    const categoryRatio = await request.get('/statistics/category-ratio');
    return {
      coreData,
      salesTrend,
      categoryRatio
    };
  },

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
