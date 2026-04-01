import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { store } from './store';
import { QueryProvider } from './query';
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
    <Provider store={store}>
      <QueryProvider>
        <ConfigProvider locale={zhCN}>
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
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<Orders />} />
                <Route path="products" element={<Products />} />
                <Route path="users" element={<Users />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ConfigProvider>
      </QueryProvider>
    </Provider>
  );
}

export default App;
