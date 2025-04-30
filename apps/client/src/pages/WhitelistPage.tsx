import { useEffect, useState } from 'react';
import { Table, Tag, Button, Select, message, Popconfirm } from 'antd';
import request from '../services/axios';
import AddExtensionModal from './AddExtensionModal';
export default function WhitelistPage() {
  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const loadData = () => {
    request.get('/whitelist').then(res => {
      setList(res.data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredList = filter ? list.filter((item: any) => item.level === filter) : list;

  const handleReevaluate = async (record: any) => {
    try {
      const { data } = await request.post('/whitelist', {
        id: record.id,
        name: record.name,
        permissions: []
      });
      message.success(`已重新评估：${record.name}，得分 ${data.score}`);
      loadData();
    } catch {
      message.error('重新评估失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await request.delete(`/whitelist/${id}`);
      message.success('删除成功');
      loadData();
    } catch {
      message.error('删除失败');
    }
  };

  const columns = [
    { title: '扩展名称', dataIndex: 'name', key: 'name' },
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: '风险等级',
      dataIndex: 'level',
      key: 'level',
      render: (text: string) => {
        const color = text === '高风险' ? 'red' : text === '中风险' ? 'orange' : 'green';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    { title: '评分', dataIndex: 'score', key: 'score' },
    {
      title: '操作',
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => handleReevaluate(record)}>重新评估</Button>
          <Popconfirm
            title="确定删除该扩展？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 800, margin: '24px auto' }}>
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="按风险等级筛选"
          style={{ width: 200 }}
          allowClear
          onChange={value => setFilter(value)}
        >
          <Select.Option value="高风险">高风险</Select.Option>
          <Select.Option value="中风险">中风险</Select.Option>
          <Select.Option value="低风险">低风险</Select.Option>
        </Select>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          添加
        </Button>
      </div>
      <Table rowKey="id" dataSource={filteredList} columns={columns} pagination={false} />
      <AddExtensionModal
        open={modalOpen}
        api="/whitelist"
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          loadData();
        }}
      />
    </div>
  );
}
