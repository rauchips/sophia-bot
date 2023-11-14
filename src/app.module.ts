import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreService } from './store/store.service';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
}),
    StoreModule,
  ],
  controllers: [AppController],
  providers: [AppService, StoreService],
})
export class AppModule {}
