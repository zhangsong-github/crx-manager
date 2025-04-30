import { Injectable } from '@nestjs/common';
import { RiskService } from '../risk/risk.service';
import { createClient } from 'redis';

const redis = createClient();
redis.connect();

@Injectable()
export class WhitelistService {
  constructor(private readonly riskService: RiskService) {}

  async addExtension({ id, name, version, permissions,  description, chromeStoreInfo }: any) {
    const key = `whitelist:${id}`;
    const existing = await redis.get(key);
    if (existing) {
      console.log(`Extension ${id} already exists in whitelist`);
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
    console.log(`Extension ${id} added to whitelist with risk level: ${risk.riskLevel}`);
    return extensionData;
  }

  async updateExtension(id: string, { name, permissions, version, description, chromeStoreInfo }: any) {
    const key = `whitelist:${id}`;
    const existing = await redis.get(key);
    if (!existing) {
      console.log(`Extension ${id} not exists in whitelist`);
      return { 
        success: false,
        errMsg: `Extension ${id} not exists in whitelist`
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
    console.log(`Extension ${id} updated in whitelist with risk level: ${risk.riskLevel}`);
    return extensionData;
  }

  async listExtensions() {
    const keys = await redis.keys('whitelist:*');
    const results = await Promise.all(
      keys.map(key => redis.get(key).then(value => JSON.parse(value!)))
    );
    console.log(`Fetched ${results.length} extensions from whitelist`);
    return results;
  }

  async removeExtension(id: string) {
    const key = `whitelist:${id}`;
    const result = await redis.del(key);
    return { success: result > 0 };
  }

  async getExtension(id: string) {
    const value = await redis.get(`whitelist:${id}`);
    return value ? JSON.parse(value) : null;
  }
}