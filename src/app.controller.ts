import {
  Logger,
  Controller,
  Get,
  Query,
  Res,
  Post,
  Req,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { MessageCategory, WebhookDto } from './app.dto';
import { MenuService } from './menu/menu.service';
import { StoreService } from './store/store.service';
import { ProfileService } from './profile/profile.service';
import { v4 as uuidv4 } from 'uuid';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly menuService: MenuService,
    private readonly storeService: StoreService,
    private readonly profileService: ProfileService,
  ) {}

  private readonly logger: Logger = new Logger(AppController.name);
  // @Get('/reports/personal')
  // async getPersonalReports(@Res() res: Response){
  //   try {
  //     res.redirect('https://webapp-231203115253.azurewebsites.net/reports/personal');
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  // @Get('/reports/group')
  // async getGroupReports(@Res() res: Response){
  //   try {
  //     res.redirect('https://localhost:7135/reports/group');
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  @Get('/webhook')
  getVerified(@Query() query: object, @Res() res: Response): Response {
    const mode: string = query['hub.mode'];
    const challenge: string = query['hub.challenge'];
    const verify_token: string = query['hub.verify_token'];

    if (this.appService.getVerified(mode, verify_token)) {
      return res.status(200).send(challenge);
    }

    return res.status(400).send();
  }

  @Post('/webhook')
  async postMessage(
    @Res() res: Response,
    @Req() req: Request,
    @Body() webHookBody: WebhookDto,
  ): Promise<Response<any, Record<string, any>>> {
    this.logger.log(
      '-----------------------start-----------------------------',
    );

    try {
      const messageType = this.appService.findMessageType(webHookBody);

      this.logger.log('message type: ' + messageType);

      if (
        messageType === MessageCategory.MESSAGE &&
        webHookBody.entry[0].changes[0].value.messages.length === 1
      ) {
        const phoneNumber: string =
          webHookBody.entry[0].changes[0].value.messages[0]['from'];
        const profileName: string =
          webHookBody.entry[0].changes[0].value.contacts[0]['profile']['name'];
        const msg_body: string =
          webHookBody.entry[0].changes[0].value.messages[0]['text']['body'];

        const sessionKey = phoneNumber + '-session';
        const menuKey = phoneNumber + '-menu';
        const startKey = phoneNumber + '-start';
        const endKey = phoneNumber + '-end';

        let session: string | null = await this.storeService.get(sessionKey);
        let start: number | null = await this.storeService.get(startKey);
        let end: number | null = await this.storeService.get(endKey);

        this.logger.log('Current Time: ' + Date.now());
        let response: string[] | null;

        let args: any[];

        let method: string | null;
        let action: string | null;

        // if (session === null && msg_body === 'Hi Sophia') {
        // }
        this.logger.log(phoneNumber);

        if (session && start && end) {
          const message_id =
            webHookBody.entry[0].changes[0].value.messages[0]['id'];
          //await this.appService.blueTick(message_id);

          method = await this.storeService.get(menuKey);
          args = [phoneNumber, msg_body];

          response = await this.menuService.menuRunner(method, args);
          if (response) {
            method = response[0];
            action = response[1];
            //await this.storeService.set(menuKey, method, 120);

            this.logger.log(
              'Set New Menu Time: ' + Math.floor((Date.now() - end) / 1000),
            );

            await this.storeService.set(
              menuKey,
              method,
              Math.floor((end - Date.now()) / 1000),
            );
          }

          this.logger.log('Current Time: ' + new Date(Date.now()));
          this.logger.log(
            'Difference Time: ' + Math.floor((Date.now() - end) / 1000),
          );
        } else {
          const profile = await this.profileService.fetchProfile(
            profileName.split(' ').join(''),
          );

          if (!profile) {
            return;
          }

          const lifetime: number = Number(process.env.lifetime);
          start = Date.now();
          end = Date.now() + lifetime * 1000;

          this.logger.log('Session started at: ' + new Date(start));
          this.logger.log('Session ends at: ' + new Date(end));

          await this.storeService.set(startKey, start, lifetime);
          await this.storeService.set(endKey, end, lifetime);

          const message_id =
            webHookBody.entry[0].changes[0].value.messages[0]['id'];
          //await this.appService.blueTick(message_id);

          session = uuidv4();
          await this.storeService.set(sessionKey, session, lifetime);

          method = 'homeMenu';
          await this.storeService.set(menuKey, method, lifetime);

          args = [phoneNumber, profileName, true];

          response = await this.menuService.menuRunner(method, args);
        }

        if (response !== null) {
          if (method === 'familyTree' || method === 'reports') {
            await this.appService.sendMessage(response[2], phoneNumber, true);
          } else {
            await this.appService.sendMessage(response[2], phoneNumber);
          }
          //method === 'familyTree' ? : await this.appService.sendMessage(response[2], process.env.to);

          this.logger.log('new menu name: ' + response[0]);

          this.logger.log('menu displayed: ' + response[2]);
        }

        if (action === 'end') {
          await this.storeService.delete(sessionKey);
          await this.storeService.delete(menuKey);
          if (method !== 'exit')
            await this.appService.sendMessage(
              'Thank you for interacting with _Sophia_, see you later! 😊',
              phoneNumber,
            );
        }
      }
      this.logger.log(
        '-----------------------end-----------------------------',
      );
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(200);
    }
  }
}
