import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUserInfo, setToken, setUserInfo } from '../utils/auth';
import { userService } from '../services/user';

// 创建 AuthContext
const AuthContext = createContext(null);

/**
 * AuthContext Provider 组件
 * 提供用户认证相关的状态和方法
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfoState] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化认证状态
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
      setToken(data.token);
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

  const value = {
    isAuthenticated,
    userInfo,
    loading,
    login,
    logout,
    fetchUserInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 使用 AuthContext 的 Hook
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
