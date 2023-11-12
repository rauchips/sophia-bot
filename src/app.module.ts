import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuService } from './menu/menu.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
}),
  ],
  controllers: [AppController],
  providers: [AppService, MenuService],
})
export class AppModule {}
