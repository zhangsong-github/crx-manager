import { useEffect, useState } from 'react';
import { Table, Tag, Button, Select, message, Popconfirm } from 'antd';
import request from '../services/axios';
import AddExtensionModal from './AddExtensionModal';

export default function BlackListPage() {
  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [sourceData, setSourceData] = useState<any>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const loadData = () => {
    request.get('/blacklist').then(res => {
      setList(res.data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredList = filter ? list.filter((item: any) => item.riskLevel === filter) : list;

  const handleReevaluate = async (record: any) => {
    try {
      const { data } = await request.post('/blacklist', {
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
      await request.delete(`/blacklist/${id}`);
      message.success('删除成功');
      loadData();
    } catch {
      message.error('删除失败');
    }
  };

  const columns = [
    { title: '扩展名称', dataIndex: 'name', key: 'name', width: 120 },
    { title: 'ID', dataIndex: 'id', key: 'id', width: 120 },
    { 
      title: '版本', 
      dataIndex: 'version', 
      key: 'version',
      width: 120,
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 120,
      render: (text: string[]) => (
        <div>
          {text.map((item, index) => (
            <Tag key={index} color="blue">{item}</Tag>
          ))}
        </div>
      )
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 120,
      render: (text: string) => {
        const color = text === '高风险' ? 'red' : text === '中风险' ? 'orange' : 'green';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    { title: '评分', dataIndex: 'score', key: 'score', width: 120 },
    {
      title: '操作',
      key: 'action',
      minWidth: 120,
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => handleReevaluate(record)}>重新评估</Button>
          <Button type="link" onClick={() => {
            setSourceData(record);
            setModalOpen(true);
          }}>编辑</Button>
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
    <div style={{ margin: '24px auto' }}>
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="按风险等级筛选"
          style={{ width: 200, marginRight: 16 }}
          allowClear
          onChange={value => setFilter(value)}
        >
          <Select.Option value="high">高风险</Select.Option>
          <Select.Option value="medium">中风险</Select.Option>
          <Select.Option value="low">低风险</Select.Option>
        </Select>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          添加
        </Button>
      </div>
      <Table rowKey="id" dataSource={filteredList} columns={columns} pagination={false} />
      <AddExtensionModal
        open={modalOpen}
        api="/blacklist"
        sourceData={sourceData}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          loadData();
        }}
      />
    </div>
  );
}
