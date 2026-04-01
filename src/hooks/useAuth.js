import { useState, useEffect } from 'react';
import { getToken, getUserInfo, setUserInfo } from '../utils/auth';
import { userService } from '../services/user';

/**
 * 用户认证 Hook
 * 用于管理用户登录状态和用户信息
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfoState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      // 从 localStorage 获取用户信息
      const storedUserInfo = getUserInfo();
      if (storedUserInfo) {
        setUserInfoState(storedUserInfo);
      } else {
        // 如果没有用户信息，从服务器获取
        fetchUserInfo();
      }
    }
    setLoading(false);
  }, []);

  /**
   * 获取用户信息
   */
  const fetchUserInfo = async () => {
    try {
      const data = await userService.getUserInfo();
      setUserInfoState(data);
      setUserInfo(data);
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  /**
   * 登录
   */
  const login = async (credentials) => {
    try {
      const data = await userService.login(credentials);
      setUserInfoState(data.userInfo);
      setUserInfo(data.userInfo);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || '登录失败' 
      };
    }
  };

  /**
   * 登出
   */
  const logout = async () => {
    try {
      await userService.logout();
      setUserInfoState(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return {
    isAuthenticated,
    userInfo,
    loading,
    login,
    logout,
    fetchUserInfo
  };
};
