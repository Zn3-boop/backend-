import React, { memo, useState } from 'react';
import { Card, Button, Table, Modal, Form, Input, Select, InputNumber, Popconfirm, Space, Tag, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useProductList, useAddProduct, useEditProduct, useDeleteProduct } from '../../query/hooks';
import { formatMoney } from '../../utils/format';
import './Products.css';

const { Option } = Select;

const Products = memo(() => {
  // 分页状态
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 新增/编辑弹窗状态
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form] = Form.useForm();

  // 使用React Query hooks获取商品列表
  const { data, isLoading, refetch } = useProductList({ page, pageSize });
  const addProductMutation = useAddProduct();
  const editProductMutation = useEditProduct();
  const deleteProductMutation = useDeleteProduct();

  // 商品分类选项
  const categories = ['手机', '电脑', '平板', '耳机', '手表', '配件'];

  // 打开弹窗时设置表单值
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingProduct) {
        await editProductMutation.mutateAsync({ id: editingProduct.id, data: values });
      } else {
        await addProductMutation.mutateAsync(values);
      }

      form.resetFields();
      setModalVisible(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 关闭弹窗时重置表单
  const handleModalCancel = () => {
    form.resetFields();
    setModalVisible(false);
    setEditingProduct(null);
  };

  // 表格列定义
  const columns = [
    {
      title: '商品图片',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <Image src={image} width={60} height={60} style={{ borderRadius: 4 }} />
      ),
      width: 100
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
      width: 100
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatMoney(price),
      width: 120
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 100
    },
    {
      title: '销量',
      dataIndex: 'sales',
      key: 'sales',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProduct(record);
              setModalVisible(true);
              form.setFieldsValue(record);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该商品吗？"
            onConfirm={() => deleteProductMutation.mutate(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
      fixed: 'right',
      width: 150
    }
  ];

  return (
    <div className="products">
      <Card
        title="商品管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingProduct(null);
              setModalVisible(true);
              form.resetFields();
            }}
          >
            新增商品
          </Button>
        }
      >
        {/* 商品表格 */}
        <Table
          columns={columns}
          dataSource={data?.list || []}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1000 }}
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

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingProduct ? '编辑商品' : '新增商品'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            category: '手机',
            price: 0,
            stock: 0,
            sales: 0
          }}
        >
          <Form.Item
            label="商品名称"
            name="name"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>

          <Form.Item
            label="商品分类"
            name="category"
            rules={[{ required: true, message: '请选择商品分类' }]}
          >
            <Select placeholder="请选择商品分类">
              {categories.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="价格"
            name="price"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              placeholder="请输入价格"
            />
          </Form.Item>

          <Form.Item
            label="库存"
            name="stock"
            rules={[{ required: true, message: '请输入库存' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="请输入库存"
            />
          </Form.Item>

          <Form.Item
            label="销量"
            name="sales"
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="请输入销量"
            />
          </Form.Item>

          <Form.Item
            label="商品图片URL"
            name="image"
          >
            <Input placeholder="请输入商品图片URL" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default Products;
