import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { statisticsService } from '../services/statistics';

// 创建统计Context
const StatisticsContext = createContext(null);

/**
 * 统计Context Provider组件
 * 提供全局统计数据管理和操作方法
 */
export const StatisticsProvider = ({ children }) => {
  // 核心数据
  const [coreData, setCoreData] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalUsers: 0
  });

  // 销售趋势数据
  const [salesTrend, setSalesTrend] = useState({
    months: [],
    data: []
  });

  // 商品分类占比
  const [categoryRatio, setCategoryRatio] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 获取核心数据
   */
  const fetchCoreData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await statisticsService.getCoreData();
      setCoreData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 获取销售趋势
   */
  const fetchSalesTrend = useCallback(async () => {
    try {
      const data = await statisticsService.getSalesTrend();
      setSalesTrend(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  /**
   * 获取商品分类占比
   */
  const fetchCategoryRatio = useCallback(async () => {
    try {
      const data = await statisticsService.getCategoryRatio();
      setCategoryRatio(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  /**
   * 刷新所有数据
   */
  const refreshAll = useCallback(() => {
    fetchCoreData();
    fetchSalesTrend();
    fetchCategoryRatio();
  }, [fetchCoreData, fetchSalesTrend, fetchCategoryRatio]);

  // 初始化加载
  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined') {
      return;
    }

    refreshAll();

    // 定时刷新（每30秒）
    const timer = setInterval(() => {
      refreshAll();
    }, 30000);

    return () => clearInterval(timer);
  }, [refreshAll]);

  const value = {
    coreData,
    salesTrend,
    categoryRatio,
    loading,
    error,
    refreshAll,
    fetchCoreData,
    fetchSalesTrend,
    fetchCategoryRatio
  };

  return <StatisticsContext.Provider value={value}>{children}</StatisticsContext.Provider>;
};

/**
 * 使用统计Context的Hook
 */
export const useStatistics = () => useContext(StatisticsContext);

export default StatisticsContext;
