import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { StoreService } from './store.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.redis_host,
      port: process.env.redis_port,
      username: process.env.redis_username,
      password: process.env.redis_password,
      no_ready_check: true,
      ttl: Number(process.env.lifetime),
    }),
  ],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
