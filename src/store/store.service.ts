import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class StoreService {
    constructor(
        @Inject(CACHE_MANAGER) private cache: Cache
    ){}

    async get(key: string){
        await this.cache.get(key);
    }

    async set(key: string, value: string) {
        await this.cache.set(key, value);
      }
}
