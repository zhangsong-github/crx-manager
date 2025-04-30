import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { PERMISSION_WEIGHTS, type PermissionRiskLevel, type PermissionItem } from './permissions.constants';

@Injectable()
export class RiskService {
  evaluateRisk(input: {
    permissions: string[];
    chromeStoreInfo?: {
      rating?: number;
      lastUpdated?: string;
      totalInstalls?: number;
      publisherExtensionCount?: number;
    };
  }) {
    const permissionItems: PermissionItem[] = [];
    const permissionRiskScore = input.permissions.reduce((total, perm) => {
      const permissionItem = PERMISSION_WEIGHTS[perm.trim()];
      if (permissionItem) {
        permissionItems.push({
          name: perm.trim(),
          ...permissionItem,
        });
      }
      return total + (permissionItem?.score || 0);
    }, 0);

    let storeScore = 0;
    let updateScore = 0;
    let developerScore = 0;

    const { chromeStoreInfo } = input;

    if (chromeStoreInfo) {
      const { rating } = chromeStoreInfo;
      // storeScore = chromeStoreInfo.rating ? (chromeStoreInfo.rating < 2 ? : ) : 0;
      if(rating) {
        // 评分越低，风险分数越高
        storeScore = rating < 2 ? 100 : rating < 3 ? 80 : rating < 4 ? 60 : rating < 4.5 ? 40 : 20;
      }
      if (chromeStoreInfo.lastUpdated) {
        const monthsAgo = dayjs().diff(dayjs(chromeStoreInfo.lastUpdated), 'month');
        // 更新时间越久，风险分数越高
        updateScore = monthsAgo < 3 ? 10 : monthsAgo < 6 ? 20 : 50;
      }
      if (chromeStoreInfo.publisherExtensionCount !== undefined) {
        developerScore = chromeStoreInfo.publisherExtensionCount >= 5 ? 20 : 10;
      }
    }

    const hasStoreInfo = !!chromeStoreInfo;
    const finalScore = hasStoreInfo
      ? permissionRiskScore * 0.6 + storeScore * 0.2 + updateScore * 0.1 + developerScore * 0.1
      : permissionRiskScore;

    let riskLevel: PermissionRiskLevel = 'low';
    // 风险等级
    riskLevel = finalScore >= 80 ? 'high' : finalScore >= 50 ? 'medium' : 'low';

    return {
      score: Math.round(finalScore),
      riskLevel,
      permissionItems
    };
  }

  getPermissionMap() {
    return PERMISSION_WEIGHTS;
  }

  getPermission(name: string) {
    const permission = PERMISSION_WEIGHTS[name];
    if (!permission) {
      return null;
    }
    return {
      name,
      ...permission,
    };
  }

  getPermissions() {
    return Object.entries(PERMISSION_WEIGHTS).map(([key, value]) => ({
      name: key,
      ...value,
    }));
  }
}
