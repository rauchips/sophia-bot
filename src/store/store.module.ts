import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { StoreService } from './store.service';

@Module({
  imports: [CacheModule.register({ isGlobal: true })],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
