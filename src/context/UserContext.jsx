import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userService } from '../services/user';

// 创建用户Context
const UserContext = createContext(null);

/**
 * 用户Context Provider组件
 * 提供全局用户状态管理和操作方法
 */
export const UserProvider = ({ children }) => {
  // 用户状态
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 初始化：从localStorage恢复登录状态
  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    const savedToken = localStorage.getItem('token');
    const savedUserInfo = localStorage.getItem('userInfo');

    if (savedToken && savedUserInfo) {
      setToken(savedToken);
      setUserInfo(JSON.parse(savedUserInfo));

      // 自动获取最新用户信息
      fetchUserInfo();
    }
  }, []);

  /**
   * 获取用户信息
   */
  const fetchUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getUserInfo();
      setUserInfo(data);
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(data));
      }
    } catch (err) {
      setError(err.message);
      // 如果获取用户信息失败，清除登录状态
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 登录
   * @param {string} email - 邮箱
   * @param {string} password - 密码
   * @returns {Promise<Object>} 登录结果
   */
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.login({ email, password });

      // 保存token和用户信息
      setToken(data.token);
      setUserInfo(data.userInfo);

      // 检查是否在浏览器环境
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
      }

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 退出登录
   */
  const logout = useCallback(() => {
    setToken(null);
    setUserInfo(null);
    // 检查是否在浏览器环境
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    }
  }, []);

  /**
   * 检查权限
   * @param {string} requiredRole - 需要的角色
   * @returns {boolean} 是否有权限
   */
  const hasPermission = useCallback((requiredRole) => {
    if (!userInfo) return false;
    const roleMap = {
      admin: 3,
      operation: 2,
      service: 1
    };
    const userRoleLevel = roleMap[userInfo.role] || 0;
    const requiredRoleLevel = roleMap[requiredRole] || 0;
    return userRoleLevel >= requiredRoleLevel;
  }, [userInfo]);

  const value = {
    userInfo,
    token,
    loading,
    error,
    login,
    logout,
    fetchUserInfo,
    hasPermission,
    isAdmin: userInfo?.role === 'admin',
    isOperation: userInfo?.role === 'operation',
    isService: userInfo?.role === 'service'
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/**
 * 使用用户Context的Hook
 */
export const useUser = () => useContext(UserContext);

export default UserContext;
