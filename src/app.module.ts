import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuService } from './menu/menu.service';
import { StoreModule } from './store/store.module';
import { StoreService } from './store/store.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    StoreModule,
  ],
  controllers: [AppController],
  providers: [AppService, MenuService, StoreService],
})
export class AppModule {}
