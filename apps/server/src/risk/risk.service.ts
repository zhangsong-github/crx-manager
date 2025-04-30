import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';

const PERMISSION_WEIGHTS: Record<string, number> = {
  webRequest: 30,
  webRequestBlocking: 30,
  tabs: 15,
  storage: 5,
  cookies: 20,
  history: 20,
  clipboardRead: 10,
  clipboardWrite: 10,
  downloads: 20,
  management: 25,
};

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
    const permissionRiskScore = input.permissions.reduce((total, perm) => {
      return total + (PERMISSION_WEIGHTS[perm.trim()] || 5);
    }, 0);

    let storeScore = 0;
    let updateScore = 0;
    let developerScore = 0;

    const { chromeStoreInfo } = input;

    if (chromeStoreInfo) {
      storeScore = chromeStoreInfo.rating ? chromeStoreInfo.rating * 20 : 0;
      if (chromeStoreInfo.lastUpdated) {
        const monthsAgo = dayjs().diff(dayjs(chromeStoreInfo.lastUpdated), 'month');
        updateScore = monthsAgo < 3 ? 20 : monthsAgo < 6 ? 10 : 0;
      }
      if (chromeStoreInfo.publisherExtensionCount !== undefined) {
        developerScore = chromeStoreInfo.publisherExtensionCount >= 5 ? 20 : 10;
      }
    }

    const hasStoreInfo = !!chromeStoreInfo;
    const finalScore = hasStoreInfo
      ? permissionRiskScore * 0.6 + storeScore * 0.2 + updateScore * 0.1 + developerScore * 0.1
      : permissionRiskScore;

    let riskLevel: '低风险' | '中风险' | '高风险' = '低风险';
    if (finalScore >= 80) riskLevel = '高风险';
    else if (finalScore >= 50) riskLevel = '中风险';

    return {
      score: Math.round(finalScore),
      level: riskLevel,
    };
  }
}
