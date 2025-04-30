import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import request from '../services/axios';

interface ExtensionData {
  id: string;
  name: string;
  permissions?: string;
}

interface ApiResponse {
  level?: string;
  score?: number;
  // 其他可能的响应字段
}

export default function AddWhitelist() {
  const [form] = Form.useForm<ExtensionData>();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: ExtensionData) => {
    try {
      setSubmitting(true);
      const { data } = await request.post<ApiResponse>('/whitelist', {
        id: values.id.trim(),
        name: values.name.trim(),
        permissions: values.permissions 
          ? values.permissions.split(',').map(p => p.trim()).filter(Boolean)
          : []
      });
      
      message.success(`扩展添加成功${
        data.level ? `，风险等级：${data.level}` : ''
      }${
        data.score ? `，评分：${data.score}` : ''
      }`);
      form.resetFields();
    } catch (err: any) {
      message.error('添加失败: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="添加扩展" style={{ maxWidth: 480, margin: '24px auto' }}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item 
          name="name" 
          label="扩展名称" 
          rules={[
            { required: true, message: '请输入扩展名称' },
            { max: 50, message: '名称不超过50字符' }
          ]}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item 
          name="id" 
          label="扩展ID" 
          rules={[
            { required: true, message: '请输入扩展ID' },
            { pattern: /^[a-zA-Z0-9_-]+$/, message: '只允许字母、数字、下划线和横线' }
          ]}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item 
          name="permissions" 
          label="权限列表（逗号分隔）" 
          tooltip="例如: tabs, storage, downloads"
          rules={[
            { pattern: /^[\w\s,]+$/, message: '只允许字母、数字、下划线和逗号' }
          ]}
        >
          <Input placeholder="tabs, storage, downloads" allowClear />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={submitting}
            disabled={submitting}
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}