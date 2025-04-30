import { useEffect, useState } from 'react';
import { Table, Tag, Button, Select, message, Popconfirm, Tooltip } from 'antd';
import request from '../services/axios';
import { usePermissions, RiskLevel, RiskColor } from '../contexts/PermissionContext';
import AddExtensionModal from './AddExtensionModal';

export default function WhitelistPage() {

  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [sourceData, setSourceData] = useState<any>(null);
  const loadData = () => {
    request.get('/whitelist').then(res => {
      setList(res.data);
    });
  };

  // const { permissionMap } = usePermissions();


  useEffect(() => {
    loadData();
  }, []);

  const filteredList = filter ? list.filter((item: any) => item.riskLevel === filter) : list;

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
    {
      title: '扩展名称',
      dataIndex: 'name',
      key: 'name',
      width: 120
    },
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id',
      width: 100
    },
    { 
      title: '版本', 
      dataIndex: 'version', 
      key: 'version',
      width: 120,
    },
    {
      title: '权限',
      dataIndex: 'permissionItems',
      key: 'permissionItems',
      minWidth: 150,
      render: (items: any[]) => (
        <div>
          {
            items.map((item, index) => {
              const riskText = RiskLevel[item.riskLevel as keyof typeof RiskLevel] || '未知风险';
              const color = RiskColor[item.riskLevel as keyof typeof RiskColor] || 'default';
              return <Tooltip placement="topLeft" title={`${item.description}，${riskText}，风险分值：${item.score}`}>
                <Tag key={index} color={color}>{item.name}</Tag>
            </Tooltip>;
            })
          }
        </div>
      )
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 120,
      render: (text: string) => {
        const color = RiskColor[text as keyof typeof RiskColor];
        return <Tag color={color}>
          {RiskLevel[text as keyof typeof RiskLevel]}
        </Tag>;
      }
    },
    { title: '评分', dataIndex: 'score', key: 'score', width: 120 },
    {
      title: '操作',
      minWidth: 100,
      render: (_: any, record: any) => (
        <>
          {/* <Button type="link" onClick={() => handleReevaluate(record)}>重新评估</Button> */}
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
      <Table
        rowKey="id"
        dataSource={filteredList}
        columns={columns}
        pagination={false}
        bordered />
      <AddExtensionModal
        open={modalOpen}
        api="/whitelist"
        onClose={() => setModalOpen(false)}
        sourceData={sourceData}
        onSuccess={() => {
          setModalOpen(false);
          loadData();
        }}
      />
    </div>
  );
}
