import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import request from '../services/axios';

const AddExtensionModal = ({ open, onClose, onSuccess, api }: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const { data } = await request.post(api, {
        id: values.id.trim(),
        name: values.name.trim(),
        permissions: values.permissions
          ? values.permissions.split(',').map((p: string) => p.trim()).filter(Boolean)
          : []
      });
      message.success(`添加成功，等级：${data.level}，评分：${data.score}`);
      form.resetFields();
      onSuccess();
      onClose();
    } catch (err: any) {
      message.error('添加失败: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="添加扩展"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="扩展名称"
          rules={[{ required: true }, { max: 50 }]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          name="id"
          label="扩展ID"
          rules={[{ required: true }, { pattern: /^[a-zA-Z0-9_-]+$/ }]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          name="permissions"
          label="权限列表（逗号分隔）"
          tooltip="如: tabs, storage, downloads"
        >
          <Input allowClear placeholder="tabs, storage, downloads" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddExtensionModal;