import { useEffect, useState } from 'react';
import { Table, Tag, Button, Select, message, Popconfirm, Tooltip } from 'antd';
import request from '../services/axios';
import { usePermissions, RiskLevel, RiskColor } from '../contexts/PermissionContext';

export default function UserListPage() {

  const [list, setList] = useState([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [whiteList, setWhiteList] = useState<any>([]);
  const [blackList, setBlackList] = useState<any>([]);

  const loadData = () => {
    request.get('/whitelist').then(res => {
      setWhiteList(res.data);
    });
    request.get('/blacklist').then(res => {
      setBlackList(res.data);
    });
    request.get('/user').then(res => {
      setList(res.data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredList = filter ? list.filter((item: any) => item.riskLevel === filter) : list;

  const handleDelete = async (id: string) => {
    try {
      await request.delete(`/user/${id}`);
      message.success('删除成功');
      loadData();
    } catch {
      message.error('删除失败');
    }
  };

  const handleBlack = async (record: any) => {
    await request.post(`/blacklist`, record);
    request.delete(`/whitelist/${record.id}`);
    message.success('操作成功');
    loadData();
  }
  const handleWhite = async (record: any) => {
    await request.post(`/whitelist`, record);
    request.delete(`/blacklist/${record.id}`);
    message.success('操作成功');
    loadData();
  }

  // 扩展列表
  const expandColumns = [
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
      render: (_: any, record: any) => {
        const isWhite = whiteList.find((item: any) => item.id === record.id);
        const isBlack = blackList.find((item: any) => item.id === record.id);
        return (
          <>
            {!isBlack  && <Popconfirm
              title="确定拉黑该扩展？"
              onConfirm={() => handleBlack(record)}
            >
              <Button type="link" danger>拉黑</Button>
            </Popconfirm> }

            {!isWhite && <Popconfirm
              title="确定加白该扩展？"
              onConfirm={() => handleWhite(record)}
            >
              <Button type="link">加白</Button>
            </Popconfirm>}
          </>
        )
      }
    }
  ];
  const expandedRowRender = (record: any) => (
    <Table
      rowKey="id"
      columns={expandColumns}
      dataSource={record.extensions || []}
      pagination={false}
    />
  );

  const columns = [
    {
      title: 'UID',
      dataIndex: 'id',
      key: 'id',
      minWidth: 100
    },
    {
      key: 'opt',
      title: '操作',
      minWidth: 100,
      render: (_: any, record: any) => (
        <>
          <Popconfirm
            title="确定删除该用户？"
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
      <Table
        rowKey="id"
        dataSource={filteredList}
        columns={columns}
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
        pagination={false}
        bordered />
    </div>
  );
}
