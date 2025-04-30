import { Injectable } from '@nestjs/common';
import { RiskService } from '../risk/risk.service';
import { createClient } from 'redis';

const redis = createClient();
redis.connect();

@Injectable()
export class BlacklistService {
  constructor(private readonly riskService: RiskService) {}

  async addExtension({ id, name, version, permissions, description, chromeStoreInfo }: any) {
    const key = `blacklist:${id}`;
    const existing = await redis.get(key);
    if (existing) {
      console.log(`Extension ${id} already exists in blacklist`);
      return JSON.parse(existing);
    }
    // TODO: get chromeStoreInfo from Chrome Web Store API
    const risk = this.riskService.evaluateRisk({ permissions, chromeStoreInfo });
    const extensionData = {
      id,
      name,
      version,
      permissions,
      description,
      chromeStoreInfo,
      ...risk,
    };
    await redis.set(key, JSON.stringify(extensionData));
    console.log(`Extension ${id} added to blacklist with risk level: ${risk.riskLevel}`);
    return extensionData;
  }
  
  async updateExtension(id: string, { name, permissions, version, description, chromeStoreInfo }: any) {
    const key = `blacklist:${id}`;
    const existing = await redis.get(key);
    if (!existing) {
      console.log(`Extension ${id} not exists in blacklist`);
      return { 
        success: false,
        errMsg: `Extension ${id} not exists in blacklist`
      };
    }
    const risk = this.riskService.evaluateRisk({ permissions, chromeStoreInfo });
    const extensionData = {
      id,
      name,
      version,
      permissions,
      description,
      chromeStoreInfo,
      ...risk,
    };
    await redis.set(key, JSON.stringify(extensionData));
    console.log(`Extension ${id} updated in blacklist with risk level: ${risk.riskLevel}`);
    return extensionData;
  }

  async listExtensions() {
    const keys = await redis.keys('blacklist:*');
    const results = await Promise.all(
      keys.map(key => redis.get(key).then(value => JSON.parse(value!)))
    );
    console.log(`Fetched ${results.length} extensions from blacklist`);
    return results;
  }

  async removeExtension(id: string) {
    const key = `blacklist:${id}`;
    const result = await redis.del(key);
    return { success: result > 0 };
  }

  async getExtension(id: string) {
    const value = await redis.get(`blacklist:${id}`);
    return value ? JSON.parse(value) : null;
  }
}