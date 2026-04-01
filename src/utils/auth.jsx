import { useAppSelector } from '../store/hooks';
import { Navigate } from 'react-router-dom';

/**
 * 路由权限守卫高阶组件
 * 用于保护需要登录或特定权限的路由
 * 
 * @param {Object} props - 组件属性
 * @param {ReactNode} props.children - 子组件
 * @param {string} props.requiredRole - 需要的角色权限（可选）
 * @returns {ReactNode} 受保护的路由组件
 */
export const PrivateRoute = ({ children, requiredRole = null }) => {
  const token = getToken();
  const userInfo = useAppSelector(state => state.user.userInfo);
  const role = useAppSelector(state => state.user.role);

  // 未登录，跳转到登录页
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 权限不足，跳转到首页
  if (requiredRole && !checkRolePermission(role, requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * 角色权限检查函数
 * @param {string} userRole - 用户角色
 * @param {string} requiredRole - 需要的角色
 * @returns {boolean} 是否有权限
 */
export const checkRolePermission = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;

  const roleMap = {
    admin: 3,
    operation: 2,
    service: 1
  };

  const userRoleLevel = roleMap[userRole] || 0;
  const requiredRoleLevel = roleMap[requiredRole] || 0;

  return userRoleLevel >= requiredRoleLevel;
};

/**
 * 获取Token
 * @returns {string|null} Token
 */
export const getToken = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage.getItem('token');
};

/**
 * 设置Token
 * @param {string} token - Token
 */
export const setToken = (token) => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem('token', token);
};

/**
 * 移除Token
 */
export const removeToken = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  localStorage.removeItem('token');
};

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息
 */
export const getUserInfo = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * 设置用户信息
 * @param {Object} userInfo - 用户信息
 */
export const setUserInfo = (userInfo) => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

/**
 * 移除用户信息
 */
export const removeUserInfo = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  localStorage.removeItem('userInfo');
};

/**
 * 检查是否登录
 * @returns {boolean} 是否登录
 */
export const isLoggedIn = () => {
  return !!getToken();
};
