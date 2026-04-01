import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { UserProvider } from './context/UserContext';
import { OrderProvider } from './context/OrderContext';
import { ProductProvider } from './context/ProductContext';
import { StatisticsProvider } from './context/StatisticsContext';
import { PrivateRoute } from './utils/auth.jsx';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Orders from './pages/Orders/Orders';
import Products from './pages/Products/Products';
import Users from './pages/Users/Users';
import Settings from './pages/Settings/Settings';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route 
                index 
                element={
                  <StatisticsProvider>
                    <Dashboard />
                  </StatisticsProvider>
                } 
              />
              <Route 
                path="orders" 
                element={
                  <OrderProvider>
                    <Orders />
                  </OrderProvider>
                } 
              />
              <Route 
                path="products" 
                element={
                  <ProductProvider>
                    <Products />
                  </ProductProvider>
                } 
              />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </UserProvider>
    </ConfigProvider>
  );
}

export default App;