import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/order';
import { debounce } from '../utils/format';

// 创建订单Context
const OrderContext = createContext(null);

/**
 * 订单Context Provider组件
 * 提供全局订单状态管理和操作方法
 */
export const OrderProvider = ({ children }) => {
  // 订单数据状态
  const [orderList, setOrderList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 搜索和筛选状态
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');

  // 分页状态
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 从localStorage恢复筛选条件
  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    const savedKeyword = localStorage.getItem('order_keyword');
    const savedStatus = localStorage.getItem('order_status');
    const savedPage = localStorage.getItem('order_page');
    const savedPageSize = localStorage.getItem('order_pageSize');

    if (savedKeyword) setKeyword(savedKeyword);
    if (savedStatus) setStatus(savedStatus);
    if (savedPage) setPage(parseInt(savedPage));
    if (savedPageSize) setPageSize(parseInt(savedPageSize));
  }, []);

  /**
   * 获取订单列表
   */
  const fetchOrderList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        pageSize,
        keyword,
        status
      };
      const data = await orderService.getOrderList(params);
      setOrderList(data.list);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, keyword, status]);

  /**
   * 搜索（防抖300ms）
   * @param {string} value - 搜索关键词
   */
  const handleSearch = useCallback(debounce((value) => {
    setKeyword(value);
    setPage(1); // 搜索时重置到第一页
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('order_keyword', value);
    }
  }, 300), []);

  /**
   * 筛选
   * @param {string} value - 订单状态
   */
  const handleFilter = useCallback((value) => {
    setStatus(value);
    setPage(1);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('order_status', value);
    }
  }, []);

  /**
   * 分页切换
   * @param {number} newPage - 新页码
   */
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('order_page', newPage);
    }
  }, []);

  /**
   * 每页条数变化
   * @param {number} newPageSize - 新的每页条数
   */
  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('order_pageSize', newPageSize);
    }
  }, []);

  /**
   * 删除订单
   * @param {string} id - 订单ID
   * @returns {Promise<Object>} 操作结果
   */
  const deleteOrder = useCallback(async (id) => {
    try {
      await orderService.deleteOrder(id);
      // 重新获取列表
      fetchOrderList();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchOrderList]);

  /**
   * 更新订单状态
   * @param {string} id - 订单ID
   * @param {string} newStatus - 新状态
   * @returns {Promise<Object>} 操作结果
   */
  const updateOrderStatus = useCallback(async (id, newStatus) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      // 重新获取列表
      fetchOrderList();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchOrderList]);

  // 监听筛选和分页变化，自动刷新数据
  useEffect(() => {
    fetchOrderList();
  }, [fetchOrderList]);

  const value = {
    orderList,
    total,
    loading,
    error,
    keyword,
    status,
    page,
    pageSize,
    handleSearch,
    handleFilter,
    handlePageChange,
    handlePageSizeChange,
    deleteOrder,
    updateOrderStatus,
    refresh: fetchOrderList
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

/**
 * 使用订单Context的Hook
 */
export const useOrder = () => useContext(OrderContext);

export default OrderContext;
