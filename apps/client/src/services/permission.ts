import request from './axios';

// 类型定义
export type PermissionRiskLevel = 'low' | 'medium' | 'high';
export interface Permission {
  id: string;
  score: number;
  riskLevel: PermissionRiskLevel;
  description: string;
  name?: string;
}
export type PermissionMap = Record<string, Permission>;

// 获取权限映射表
export const fetchPermissionMap = async (): Promise<PermissionMap> => {
  try {
    const { data } = await request.get<PermissionMap>('/risk/permissionmap');
    return data;
  } catch (error) {
    console.error('Failed to fetch permissions:', error);
    return {}; // 返回空对象作为降级处理
  }
};