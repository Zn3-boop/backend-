import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order';
import { productService } from '../services/product';
import { userService } from '../services/user';
import { statisticsService } from '../services/statistics';
import { settingsService } from '../services/settings';

// 订单相关hooks
export const useOrderList = (params) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderService.getOrderList(params),
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderService.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// 商品相关hooks
export const useProductList = (params) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProductList(params),
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productService.addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useEditProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productService.editProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// 用户相关hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useUserInfo = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: userService.getUserInfo,
    enabled: !!localStorage.getItem('token'),
  });
};

export const useUserList = (params) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUserList(params),
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useEditUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => userService.editUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// 统计数据相关hooks
export const useStatistics = () => {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: statisticsService.getStatistics,
  });
};

// 设置相关hooks
export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings,
  });
};

export const useSaveSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsService.saveSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};
