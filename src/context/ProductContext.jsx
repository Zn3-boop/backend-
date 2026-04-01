import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productService } from '../services/product';

// 创建商品Context
const ProductContext = createContext(null);

/**
 * 商品Context Provider组件
 * 提供全局商品状态管理和操作方法
 */
export const ProductProvider = ({ children }) => {
  // 商品数据状态
  const [productList, setProductList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 分页状态
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 新增/编辑弹窗状态
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  /**
   * 获取商品列表
   */
  const fetchProductList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, pageSize };
      const data = await productService.getProductList(params);
      setProductList(data.list);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  /**
   * 分页切换
   * @param {number} newPage - 新页码
   */
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  /**
   * 每页条数变化
   * @param {number} newPageSize - 新的每页条数
   */
  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  }, []);

  /**
   * 打开新增弹窗
   */
  const openAddModal = useCallback(() => {
    setEditingProduct(null);
    setModalVisible(true);
  }, []);

  /**
   * 打开编辑弹窗
   * @param {Object} product - 商品信息
   */
  const openEditModal = useCallback((product) => {
    setEditingProduct(product);
    setModalVisible(true);
  }, []);

  /**
   * 关闭弹窗
   */
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingProduct(null);
  }, []);

  /**
   * 新增商品
   * @param {Object} productData - 商品数据
   * @returns {Promise<Object>} 操作结果
   */
  const addProduct = useCallback(async (productData) => {
    try {
      await productService.addProduct(productData);
      closeModal();
      fetchProductList();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [closeModal, fetchProductList]);

  /**
   * 编辑商品
   * @param {number} id - 商品ID
   * @param {Object} productData - 商品数据
   * @returns {Promise<Object>} 操作结果
   */
  const editProduct = useCallback(async (id, productData) => {
    try {
      await productService.editProduct(id, productData);
      closeModal();
      fetchProductList();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [closeModal, fetchProductList]);

  /**
   * 删除商品
   * @param {number} id - 商品ID
   * @returns {Promise<Object>} 操作结果
   */
  const deleteProduct = useCallback(async (id) => {
    try {
      await productService.deleteProduct(id);
      fetchProductList();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchProductList]);

  // 监听分页变化，自动刷新数据
  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined') {
      return;
    }

    fetchProductList();
  }, [fetchProductList]);

  const value = {
    productList,
    total,
    loading,
    error,
    page,
    pageSize,
    modalVisible,
    editingProduct,
    handlePageChange,
    handlePageSizeChange,
    openAddModal,
    openEditModal,
    closeModal,
    addProduct,
    editProduct,
    deleteProduct,
    refresh: fetchProductList
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

/**
 * 使用商品Context的Hook
 */
export const useProduct = () => useContext(ProductContext);

export default ProductContext;
