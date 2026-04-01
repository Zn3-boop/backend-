import React, { memo } from 'react';
import { Card, Input, Select, Button, Table, Tag, Popconfirm, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useOrder } from '../../context/OrderContext';
import { useUser } from '../../context/UserContext';
import { formatMoney, formatDate } from '../../utils/format';
import './Orders.css';

const { Search } = Input;
const { Option } = Select;

const Orders = memo(() => {
  const {
    orderList,
    total,
    loading,
    keyword,
    status,
    page,
    pageSize,
    handleSearch,
    handleFilter,
    handlePageChange,
    handlePageSizeChange,
    deleteOrder,
    updateOrderStatus
  } = useOrder();

  const { isAdmin, isService } = useUser();

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
            onChange={(value) => updateOrderStatus(record.id, value)}
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
              onConfirm={() => deleteOrder(record.id)}
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
            onSearch={handleSearch}
            defaultValue={keyword}
          />
          <Select
            value={status}
            style={{ width: 150, marginLeft: 16 }}
            onChange={handleFilter}
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
              handleSearch('');
              handleFilter('');
            }}
            style={{ marginLeft: 16 }}
          >
            重置
          </Button>
        </div>

        {/* 订单表格 */}
        <Table
          columns={columns}
          dataSource={orderList}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: handlePageChange,
            onShowSizeChange: handlePageSizeChange
          }}
        />
      </Card>
    </div>
  );
});

export default Orders;
