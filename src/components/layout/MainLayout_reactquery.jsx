import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Breadcrumb } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/userSlice';
import { removeToken, removeUserInfo } from '../../utils/auth';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(state => state.user.userInfo);
  const role = useAppSelector(state => state.user.role);

  // 根据用户角色生成菜单
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '首页'
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: '订单管理'
    },
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: '商品管理'
    }
  ];

  // 管理员和运营可访问用户管理
  if (role === 'admin' || role === 'operation') {
    menuItems.push({
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理'
    });
  }

  // 仅管理员可访问系统设置
  if (role === 'admin') {
    menuItems.push({
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置'
    });
  }

  // 菜单点击
  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  // 退出登录
  const handleLogout = () => {
    dispatch(logout());
    removeToken();
    removeUserInfo();
    navigate('/login');
  };

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout
    }
  ];

  // 获取菜单标题
  const getMenuTitle = (path) => {
    const item = menuItems.find(i => i.key === path);
    return item ? item.label : '';
  };

  // 面包屑
  const breadcrumbItems = [
    { title: '首页' },
    { title: getMenuTitle(location.pathname) }
  ];

  return (
    <Layout className="main-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="layout-sider"
      >
        <div className="logo">
          <h2>{collapsed ? '后台' : '电商后台'}</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout>
        <Header className="layout-header">
          <div className="header-left">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed)
              }
            )}
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="header-right">
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="user-info">
                <Avatar icon={<UserOutlined />} />
                <span className="username">{userInfo?.username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
