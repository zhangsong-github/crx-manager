import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchPermissionMap } from '../services/permission';
import { PermissionMap } from '../services/permission';

export enum RiskLevel {
  low = '低风险',
  medium = '中风险',
  high = '高风险'
}

export enum RiskColor  {
  low = 'green',
  medium = 'orange',
  high = 'red'
}

interface PermissionContextType {
  permissionMap: PermissionMap;
  loading: boolean;
  refresh: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextType>({
  permissionMap: {},
  loading: true,
  refresh: async () => {},
});

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissionMap, setPermissionMap] = useState<PermissionMap>({});
  const [loading, setLoading] = useState(true);

  const loadPermissions = async () => {
    setLoading(true);
    try {
      const data = await fetchPermissionMap();
      setPermissionMap(data);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载 + 页面刷新时重新加载
  useEffect(() => {
    loadPermissions();
    
    // 监听页面可见性变化（当用户返回页面时刷新）
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadPermissions();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <PermissionContext.Provider
      value={{
        permissionMap,
        loading,
        refresh: loadPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

// 自定义 Hook 便于子组件使用
export const usePermissions = () => useContext(PermissionContext);