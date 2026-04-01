import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// 创建QueryClient实例
export const queryClient = new QueryClient();

// React Query Provider组件
export const QueryProvider = ({ children }) => {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    children
  );
};
