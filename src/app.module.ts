import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuService } from './menu/menu.service';
import { StoreModule } from './store/store.module';
import { ProfileService } from './profile/profile.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    StoreModule,
  ],
  controllers: [AppController],
  providers: [AppService, MenuService, ProfileService],
})
export class AppModule {}
