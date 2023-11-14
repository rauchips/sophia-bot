import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class StoreService {
    constructor(
        private readonly cache: Cache
    ){}

    async get(key: string){
        this.cache.get(key);
    }

    async set(key: string, value: string) {
        await this.cache.set(key, value);
      }
}
