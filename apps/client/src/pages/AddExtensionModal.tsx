import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import request from '../services/axios';

const AddExtensionModal = ({ open, onClose, onSuccess, api, sourceData }: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  if (sourceData) {
    form.setFieldsValue({
      id: sourceData.id || '',
      name: sourceData.name || '',
      version: sourceData.version || '',
      permissions: sourceData.permissions?.join(', '),
      description: sourceData.description || '',
    });
  }

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      // Check if the ID already exists
      if(sourceData && sourceData.id === values.id) {
        // 更新扩展
        await request.put(`${api}/${values.id}`, {
          name: values.name.trim(),
          version: values.version.trim(),
          permissions: values.permissions
            ? values.permissions.split(',').map((p: string) => p.trim()).filter(Boolean)
            : [],
          description: values.description.trim(),
        });
        message.success('更新成功');
        form.resetFields();
        onSuccess();
        onClose();
        return;
      }
      const { data } = await request.post(api, {
        id: values.id.trim(),
        name: values.name.trim(),
        version: values.version.trim(),
        permissions: values.permissions
          ? values.permissions.split(',').map((p: string) => p.trim()).filter(Boolean)
          : [],
        description: values.description.trim(),
      });
      message.success(`添加成功，等级：${data.riskLevel}，评分：${data.score}`);
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
          rules={[{ required: true, message: '请输入扩展名称' }, { max: 200 }]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          name="id"
          label="扩展ID"
          rules={[
            { required: true, message: '请输入扩展ID' }, 
            { pattern: /^[a-z]+$/, message: '扩展ID仅支持小写英文字母' },
          ]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          name="version"
          label="扩展版本"
          rules={[{ required: true, message: '请输入扩展版本' }, { max: 20 }]}
        >
          <Input allowClear placeholder="如: 1.0.0" />
        </Form.Item>
        <Form.Item
          name="permissions"
          label="权限列表（逗号分隔）"
          tooltip="如: tabs, storage, downloads"
          rules={[
            { required: true, message: '请输入权限列表' },
            { pattern: /^[a-zA-Z0-9_,.]+$/, message: '权限列表格式不正确' },
          ]}
        >
          <Input allowClear placeholder="tabs, storage, downloads" />
        </Form.Item>
        <Form.Item
          name="description"
          label="扩展描述"
          rules={[{ max: 200 }]}
        >
          <Input.TextArea allowClear showCount maxLength={200} />
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