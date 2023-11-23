import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class StoreService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async get(key: string): Promise<string> {
    let value: string | null;

    value = await this.cache.get<string>(key);

    return value === undefined ? (value = null) : value;
  }

  async set(key: string, value: string, ttl: number) {
    await this.cache.set(key, value, ttl);
  }

  async delete(key: string) {
    await this.cache.del(key);
  }
}
