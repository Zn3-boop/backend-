import React, { memo, useState } from 'react';
import { Card, Form, Input, Switch, Select, Button, message, InputNumber } from 'antd';
import './Settings.css';

const { Option } = Select;

const Settings = memo(() => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 系统设置默认值
  const defaultSettings = {
    siteName: '电商后台管理系统',
    siteDescription: '专业的电商后台管理系统',
    enableRegistration: true,
    enableEmailVerification: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5
  };

  // 保存设置
  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      // 这里可以添加保存设置的逻辑
      console.log('保存设置:', values);
      message.success('设置保存成功');
    } catch (error) {
      console.error('表单验证失败:', error);
      message.error('设置保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置设置
  const handleReset = () => {
    form.setFieldsValue(defaultSettings);
  };

  return (
    <div className="settings">
      <Card title="系统设置">
        <Form
          form={form}
          layout="vertical"
          initialValues={defaultSettings}
        >
          <Card title="基本设置" style={{ marginBottom: 20 }}>
            <Form.Item
              label="网站名称"
              name="siteName"
              rules={[{ required: true, message: '请输入网站名称' }]}
            >
              <Input placeholder="请输入网站名称" />
            </Form.Item>

            <Form.Item
              label="网站描述"
              name="siteDescription"
            >
              <Input.TextArea placeholder="请输入网站描述" rows={3} />
            </Form.Item>
          </Card>

          <Card title="用户设置" style={{ marginBottom: 20 }}>
            <Form.Item
              label="启用用户注册"
              name="enableRegistration"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="启用邮箱验证"
              name="enableEmailVerification"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="会话超时时间（分钟）"
              name="sessionTimeout"
              rules={[
                { required: true, message: '请输入会话超时时间' },
                { type: 'number', min: 5, max: 120, message: '会话超时时间应在5-120分钟之间' }
              ]}
            >
              <InputNumber min={5} max={120} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="最大登录尝试次数"
              name="maxLoginAttempts"
              rules={[
                { required: true, message: '请输入最大登录尝试次数' },
                { type: 'number', min: 1, max: 10, message: '最大登录尝试次数应在1-10之间' }
              ]}
            >
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
          </Card>

          <Card title="通知设置">
            <Form.Item
              label="启用邮件通知"
              name="enableEmailNotifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="启用短信通知"
              name="enableSmsNotifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>

          <div className="form-actions">
            <Button
              type="primary"
              onClick={handleSave}
              loading={loading}
              style={{ marginRight: 10 }}
            >
              保存设置
            </Button>
            <Button onClick={handleReset}>
              重置
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
});

export default Settings;