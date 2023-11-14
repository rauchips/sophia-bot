import { Module, } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { StoreService } from './store.service';

@Module({
  imports: [
    CacheModule.register({
        isGlobal: true,
        store: redisStore,
        host: 'localhost',
        port: 6379,
      }),
  ],
  providers: [StoreService],
  exports: [StoreService]
})

@Module({})
export class StoreModule {}
