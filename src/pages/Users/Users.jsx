import React, { memo } from 'react';
import { Card, Table, Tag, Space, Button, Modal, Form, Input, Select, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import './Users.css';

const { Option } = Select;

const Users = memo(() => {
  // 模拟用户数据
  const userList = [
    {
      id: 1,
      username: '管理员',
      email: 'admin@example.com',
      role: 'admin',
      createTime: '2024-01-01 00:00:00'
    },
    {
      id: 2,
      username: '运营专员',
      email: 'operation@example.com',
      role: 'operation',
      createTime: '2024-01-02 00:00:00'
    },
    {
      id: 3,
      username: '客服',
      email: 'service@example.com',
      role: 'service',
      createTime: '2024-01-03 00:00:00'
    }
  ];

  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState(null);
  const [form] = Form.useForm();

  // 角色选项
  const roles = [
    { value: 'admin', label: '管理员' },
    { value: 'operation', label: '运营专员' },
    { value: 'service', label: '客服' }
  ];

  // 打开新增弹窗
  const openAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑弹窗
  const openEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  // 关闭弹窗
  const closeModal = () => {
    setModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  // 保存用户
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // 这里可以添加保存用户的逻辑
      console.log('保存用户:', values);
      closeModal();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除用户
  const handleDelete = (id) => {
    // 这里可以添加删除用户的逻辑
    console.log('删除用户:', id);
  };

  // 表格列定义
  const columns = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 150
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleMap = {
          admin: { color: 'red', text: '管理员' },
          operation: { color: 'blue', text: '运营专员' },
          service: { color: 'green', text: '客服' }
        };
        const { color, text } = roleMap[role] || { color: 'default', text: role };
        return <Tag color={color}>{text}</Tag>;
      },
      width: 120
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该用户吗？"
            onConfirm={() => handleDelete(record.id)}
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
    <div className="users">
      <Card
        title="用户管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAddModal}
          >
            新增用户
          </Button>
        }
      >
        {/* 用户表格 */}
        <Table
          columns={columns}
          dataSource={userList}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width={500}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingUser || {
            role: 'service'
          }}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={editingUser ? [] : [{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              {roles.map(role => (
                <Option key={role.value} value={role.value}>
                  {role.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default Users;