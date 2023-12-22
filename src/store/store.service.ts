import { Logger, Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class StoreService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  private readonly logger: Logger = new Logger(StoreService.name);

  async get(key: string): Promise<any> {
    let value: string | null;

    try {
      value = await this.cache.get<string>(key);
      this.logger.log('key: ' + key + ' value: ****');
    } catch (error) {
      console.log(error);
    }

    return value === undefined ? (value = null) : value;
  }

  async set(key: string, value: any, ttl: number) {
    try {
      await this.cache.set(key, value, {
        ttl,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async delete(key: string) {
    try {
      await this.cache.del(key);
    } catch (error) {
      console.log(error);
    }
  }
}
