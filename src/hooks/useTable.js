import { useState, useEffect } from 'react';

/**
 * 表格数据管理 Hook
 * 用于管理表格的分页、筛选和排序
 * @param {Function} fetchApi - 获取数据的API函数
 * @param {Object} initialParams - 初始查询参数
 */
export const useTable = (fetchApi, initialParams = {}) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({});
  const [params, setParams] = useState(initialParams);

  /**
   * 获取表格数据
   */
  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const response = await fetchApi({
        page,
        pageSize,
        ...params,
        ...filters
      });

      setDataSource(response.list || []);
      setPagination({
        current: response.page || page,
        pageSize: response.pageSize || pageSize,
        total: response.total || 0
      });
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理分页变化
   */
  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize
    });
    fetchData(page, pageSize);
  };

  /**
   * 处理筛选变化
   */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({
      ...pagination,
      current: 1
    });
  };

  /**
   * 重置筛选
   */
  const resetFilters = () => {
    setFilters({});
    setPagination({
      ...pagination,
      current: 1
    });
    fetchData(1, pagination.pageSize);
  };

  /**
   * 刷新数据
   */
  const refresh = () => {
    fetchData(pagination.current, pagination.pageSize);
  };

  // 初始加载数据
  useEffect(() => {
    fetchData();
  }, [params]);

  return {
    dataSource,
    loading,
    pagination,
    filters,
    setParams,
    handlePageChange,
    handleFilterChange,
    resetFilters,
    refresh
  };
};
