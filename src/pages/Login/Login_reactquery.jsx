import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../query/hooks';
import { useAppDispatch } from '../../store/hooks';
import { setToken, setUserInfo, setRole } from '../../store/slices/userSlice';
import './Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const dispatch = useAppDispatch();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await loginMutation.mutateAsync(values);

      // 保存token和用户信息到Redux store
      dispatch(setToken(result.token));
      dispatch(setUserInfo(result.userInfo));
      dispatch(setRole(result.userInfo.role));

      // 同时也保存到localStorage，以便刷新页面后恢复
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userInfo', JSON.stringify(result.userInfo));
      }

      message.success('登录成功');
      navigate('/');
    } catch (error) {
      message.error(error.message || '登录失败');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <Card className="login-card" title="电商后台管理系统">
        <Form
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="邮箱"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className="login-tips">
          <p>测试账号：</p>
          <p>管理员：admin@example.com / 123456</p>
          <p>运营：operation@example.com / 123456</p>
          <p>客服：service@example.com / 123456</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
