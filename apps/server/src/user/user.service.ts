import { Injectable } from '@nestjs/common';
import { RiskService } from '../risk/risk.service';
import { createClient } from 'redis';

interface extensionInfo {
  id: string;
  name: string;
  version: string;
  permissions?: string[];
  description?: string;
  chromeStoreInfo?: any;
}

const redis = createClient();
redis.connect();

@Injectable()
export class UserService {
  constructor(private readonly riskService: RiskService) {}

  async addUser({ id, extensions }: { id: string; extensions: extensionInfo[] }) {
    const key = `user:${id}`;
    const existing = await redis.get(key);
    if (existing) {
      console.log(`User ${id} already exists in users`);
      return this.updateUser({ id, extensions });
    }
    // TODO: get chromeStoreInfo from Chrome Web Store API
    extensions = extensions.map(extension => ({
      ...extension,
      risk: this.riskService.evaluateRisk({ ...extension, permissions: extension.permissions || []}),
    }));
    const userData = {
      id,
      extensions,
    }
    await redis.set(key, JSON.stringify(userData));
    console.log(`User ${id} added to users success.`);
    return ;
  }
  
  async updateUser({id, extensions}: { id: string; extensions: extensionInfo[] }) {
    const key = `user:${id}`;
    const existing = await redis.get(key);
    if (!existing) {
      const res = await this.addUser({ id, extensions });
      return res; 
    }
    const userData = JSON.parse(existing);
    const extensionData = userData.extensions.map(extension => {
      const risk = this.riskService.evaluateRisk({ ...extension, permissions: extension.permissions || [] });
      return {
        ...extension,
        risk,
      };
    });
    
    await redis.set(key, JSON.stringify({
      ...userData,
      id,
      extensions: extensionData,
    }));
    console.log(`User ${id} updated in users success.`);
    return userData;
  }

  async listUsers() {
    const keys = await redis.keys('user:*');
    const results = await Promise.all(
      keys.map(key => redis.get(key).then(value => JSON.parse(value!)))
    );
    console.log(`Fetched ${results.length} users.`);
    return results;
  }

  async removeUser(id: string) {
    const key = `user:${id}`;
    const result = await redis.del(key);
    return { success: result > 0 };
  }

  async getUser(id: string) {
    const value = await redis.get(`user:${id}`);
    return value ? JSON.parse(value) : null;
  }
}