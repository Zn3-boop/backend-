import React, { memo, useState } from 'react';
import { Card, Input, Select, Button, Table, Tag, Popconfirm, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useOrderList, useDeleteOrder, useUpdateOrderStatus } from '../../query/hooks';
import { useAppSelector } from '../../store/hooks';
import { formatMoney, formatDate } from '../../utils/format';
import './Orders.css';

const { Search } = Input;
const { Option } = Select;

const Orders = memo(() => {
  // 从Redux store获取用户信息
  const { role } = useAppSelector(state => state.user);
  const isAdmin = role === 'admin';
  const isService = role === 'service';

  // 搜索和筛选状态
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');

  // 分页状态
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 使用React Query hooks获取订单列表
  const { data, isLoading, error, refetch } = useOrderList({ page, pageSize, keyword, status });
  const deleteOrderMutation = useDeleteOrder();
  const updateOrderStatusMutation = useUpdateOrderStatus();

  // 订单状态选项
  const statusOptions = [
    { value: '', label: '全部状态' },
    { value: 'pending', label: '待支付' },
    { value: 'paid', label: '已支付' },
    { value: 'shipped', label: '已发货' },
    { value: 'completed', label: '已完成' },
    { value: 'cancelled', label: '已取消' }
  ];

  // 状态标签颜色
  const statusColorMap = {
    pending: 'default',
    paid: 'processing',
    shipped: 'warning',
    completed: 'success',
    cancelled: 'error'
  };

  // 表格列定义
  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180
    },
    {
      title: '商品信息',
      key: 'product',
      render: (_, record) => (
        <div className="product-info">
          <img src={record.productImage} alt="" className="product-image" />
          <span className="product-name">{record.productName}</span>
        </div>
      ),
      width: 250
    },
    {
      title: '客户姓名',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 120
    },
    {
      title: '订单金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => formatMoney(amount),
      width: 120
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Tag color={statusColorMap[status]}>{record.statusLabel}</Tag>
      ),
      width: 120
    },
    {
      title: '下单时间',
      dataIndex: 'orderTime',
      key: 'orderTime',
      render: (time) => formatDate(time),
      width: 180
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Select
            value={record.status}
            style={{ width: 100 }}
            disabled={isService}
            onChange={(value) => updateOrderStatusMutation.mutate({ id: record.id, status: value })}
          >
            {statusOptions.slice(1).map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          {!isService && (
            <Popconfirm
              title="确定删除该订单吗？"
              onConfirm={() => deleteOrderMutation.mutate(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger size="small">
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
      fixed: 'right',
      width: 180
    }
  ];

  return (
    <div className="orders">
      <Card>
        {/* 搜索和筛选 */}
        <div className="filter-bar">
          <Search
            placeholder="按订单号或客户姓名搜索"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            style={{ width: 300 }}
            onSearch={(value) => {
              setKeyword(value);
              setPage(1);
            }}
            defaultValue={keyword}
          />
          <Select
            value={status}
            style={{ width: 150, marginLeft: 16 }}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            {statusOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setKeyword('');
              setStatus('');
            }}
            style={{ marginLeft: 16 }}
          >
            重置
          </Button>
        </div>

        {/* 订单表格 */}
        <Table
          columns={columns}
          dataSource={data?.list || []}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1200 }}
          pagination={{
            current: page,
            pageSize,
            total: data?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: setPage,
            onShowSizeChange: (_, size) => {
              setPageSize(size);
              setPage(1);
            }
          }}
        />
      </Card>
    </div>
  );
});

export default Orders;
