# 电商后台管理系统

一个基于 React + Vite 构建的现代化电商后台管理系统，提供完整的商品管理、订单管理、用户管理等功能。

## 功能特性

- 📊 数据可视化仪表板
- 👥 用户管理与权限控制
- 📦 商品管理
- 🛒 订单管理
- ⚙️ 系统设置
- 🔐 身份认证与授权
- 📈 统计分析

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite 5
- **路由管理**: React Router DOM 6
- **UI 组件库**: Ant Design 5
- **HTTP 客户端**: Axios
- **图表库**: ECharts
- **日期处理**: Day.js
- **模拟数据**: Mock.js


## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 主要依赖版本

- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.20.0
- antd: ^5.12.0
- axios: ^1.6.2
- echarts: ^5.4.3
- echarts-for-react: ^3.0.2
- dayjs: ^1.11.10
- mockjs: ^1.1.0
- @ant-design/icons: ^5.2.6

### 自定义 Hooks

- `useAuth`: 认证相关逻辑
- `useTable`: 表格数据管理

### API 服务

所有 API 请求都通过 `services` 目录下的模块进行管理。

