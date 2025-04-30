import { Injectable } from '@nestjs/common';
import { RiskService } from '../risk/risk.service';
import { createClient } from 'redis';

const redis = createClient();
redis.connect();

@Injectable()
export class WhitelistService {
  constructor(private readonly riskService: RiskService) {}

  async addExtension({ id, name, permissions, chromeStoreInfo }: any) {
    // TODO: get chromeStoreInfo from Chrome Web Store API
    const risk = this.riskService.evaluateRisk({ permissions, chromeStoreInfo });
    const key = `whitelist:${id}`;
    await redis.set(key, JSON.stringify({ id, name, ...risk, permissions }));
    console.log(`Extension ${id} added to whitelist with risk level: ${risk.level}`);
    return { id, name, ...risk };
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