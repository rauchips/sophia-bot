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
import { v4 as uuidv4 } from 'uuid';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly menuService: MenuService,
    private readonly storeService: StoreService,
  ) {}

  private readonly logger: Logger = new Logger(AppController.name);

  @Get('/webhooks')
  getVerified(@Query() query: object, @Res() res: Response): Response {
    const mode: string = query['hub.mode'];
    const challenge: string = query['hub.challenge'];
    const verify_token: string = query['hub.verify_token'];

    try {
      if (this.appService.getVerified(mode, verify_token)) {
        return res.status(200).send(challenge);
      }

      return res.status(400).send();
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  @Post('/webhooks')
  async postMessage(
    @Res() res: Response,
    @Req() req: Request,
    @Body() webHookBody: WebhookDto,
  ): Promise<Response<any, Record<string, any>>> {
    this.logger.log(
      '-----------------------start-----------------------------',
    );

    //this.logger.log('Wenhook Body:  ' + JSON.stringify(webHookBody));
    try {
      const messageType = this.appService.findMessageType(webHookBody);

      if (
        messageType === MessageCategory.MESSAGE &&
        webHookBody.entry[0].changes[0].value.messages.length === 1
      ) {
        const phoneNumber: string =
          webHookBody.entry[0].changes[0].value.messages[0]['from'];
        const profileName: string =
          webHookBody.entry[0].changes[0].value.contacts[0]['profile']['name'];

        this.logger.log(
          `ProfileName: ${profileName} ~ PhoneNumber: ${phoneNumber} ~ MessageType: ${messageType}`,
        );
        const msg_body: string =
          webHookBody.entry[0].changes[0].value.messages[0]['text']['body'];

        //declare session, menu, start, end, pin and next menu keys
        const sessionKey = phoneNumber + '-session';
        const menuKey = phoneNumber + '-menu';
        const startKey = phoneNumber + '-start';
        const endKey = phoneNumber + '-end';
        const pinKey = phoneNumber + '-pin';
        const nextMenuKey = phoneNumber + '-next';

        let session: string | null = await this.storeService.get(sessionKey);
        let start: number | null = await this.storeService.get(startKey);
        let end: number | null = await this.storeService.get(endKey);
        let response: string[] | null;
        let args: any[];
        let method: string | null;
        let action: string | null;

        if (!(session && start && end)) {
          //Fetch user profile
          const profile = await this.appService.fetchProfile(
            profileName.split(' ').join(''),
          );

          //if user does not exist return
          if (!profile) {
            this.logger.log(
              '-----------------------end-----------------------------',
            );

            return res.sendStatus(200);
          }

          //hi sophia
          if (msg_body.toLocaleLowerCase() !== 'hi sophia') {
            this.logger.log(
              '-----------------------end-----------------------------',
            );

            await this.appService.sendMessage(
              `Hi _${profileName}_, to interact with _Sophia_, kindly send: *Hi Sophia*`,
              phoneNumber,
            );
            return res.sendStatus(200);
          }

          //extract message id and send a blue tick to the user for that message id
          const message_id =
            webHookBody.entry[0].changes[0].value.messages[0]['id'];
          await this.appService.blueTick(message_id);

          //assign session, start, end, method and arguments
          const lifetime: number = Number(process.env.lifetime);
          session = uuidv4();
          start = Date.now();
          end = Date.now() + lifetime * 1000;
          method = 'pin';
          args = [profileName, 'homeMenu'];

          //cache session, start, end, method
          await this.storeService.set(sessionKey, session, lifetime);
          await this.storeService.set(startKey, start, lifetime);
          await this.storeService.set(endKey, end, lifetime);
          await this.storeService.set(menuKey, method, lifetime);

          //run menu
          response = await this.menuService.menuRunner(method, args);

          method = response[0];
          action = response[1];

          //cache next menu to be called by pin
          await this.storeService.set(nextMenuKey, action, lifetime);

          //to be removed set pin to 1234
          await this.storeService.set(pinKey, '1234', lifetime);
        } else {
          //extract message id and send a blue tick to the user for that message id
          const message_id =
            webHookBody.entry[0].changes[0].value.messages[0]['id'];
          await this.appService.blueTick(message_id);

          //get method from cache and swtich accordingly
          method = await this.storeService.get(menuKey);

          switch (method) {
            case 'pin':
              //retrieve pin emojis set by sophia core
              const pin = await this.storeService.get(pinKey);

              //compare emojis receieved from user and the one set by sophia core
              if (msg_body === pin) {
                method = await this.storeService.get(nextMenuKey);
                args = [phoneNumber];

                response = await this.menuService.menuRunner(method, args);

                if (response) {
                  method = response[0];
                  action = response[1];

                  await this.storeService.set(
                    menuKey,
                    method,
                    Math.floor((end - Date.now()) / 1000),
                  );
                }
              } else {
                method = 'wrongPin';
                args = [phoneNumber, profileName];
                response = await this.menuService.menuRunner(method, args);

                method = response[0];
                action = response[1];
              }

              break;

            default:
              args = [profileName, msg_body];

              response = await this.menuService.menuRunner(method, args);

              if (response) {
                method = response[0];
                action = response[1];

                if(action !== 'end'){
                  //cache next menu to be called by pin
                  await this.storeService.set(nextMenuKey, action, Math.floor((end - Date.now()) / 1000));
                }

                await this.storeService.set(
                  menuKey,
                  method,
                  Math.floor((end - Date.now()) / 1000),
                );
              }

              break;
          }
        }

        if (response) {
          if (method === 'familyTree' || method === 'reports') {
            await this.appService.sendMessage(response[2], phoneNumber, true);
          } else {
            await this.appService.sendMessage(response[2], phoneNumber);
          }
        }

        if (action === 'end') {
          await this.storeService.delete(sessionKey);
          await this.storeService.delete(startKey);
          await this.storeService.delete(endKey);
          await this.storeService.delete(menuKey);
          await this.storeService.delete(pinKey);
          await this.storeService.delete(nextMenuKey);

          if (method !== 'exit')
            await this.appService.sendMessage(
              'Thank you for interacting with _Sophia_, see you soon! 😊',
              phoneNumber,
            );
        }
      } else {
        const status = webHookBody.entry[0].changes[0].value.statuses[0].status;
        const recipient =
          webHookBody.entry[0].changes[0].value.statuses[0].recipient_id;
        this.logger.log(
          `PhoneNumber: ${recipient} ~ MessageType: ${messageType} ~ MessageStatus: ${status}`,
        );
      }

      this.logger.log(
        '-----------------------end-----------------------------',
      );

      return res.sendStatus(200);
    } catch (error) {
      this.logger.error(error.message);

      return res.sendStatus(200);
    }
  }
}
