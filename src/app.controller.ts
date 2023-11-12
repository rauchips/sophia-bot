import { Controller, Get, Query, Res, Post, Req, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import axios, { HttpStatusCode } from 'axios';
import { MessageCategory, WebhookDto } from './app.dto';
import { MenuService } from './menu/menu.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly menuService: MenuService
    ) {}

  @Get('/webhook')
  getVerified(
    @Query() query: object,
    @Res() res: Response,
  ): Response {
    // console.log(query);
    // console.log(query["hub.mode"]);

    const mode: string = query["hub.mode"];
    const challenge: string = query["hub.challenge"];
    const verify_token: string = query["hub.verify_token"];

    if(this.appService.getVerified(mode, verify_token)){
      return res.status(200).send(challenge);
    }
    
    return res.status(400).send();
    
  }

  @Post('/webhook')
  async  postMessage(
    @Res() res: Response,
    @Req() req: Request,
    @Body() webHookBody: WebhookDto
  ): Promise<Response<any, Record<string, any>>>{
    console.log("-----------------------start-----------------------------");

    try {
      const messageType = this.appService.findMessageType(webHookBody);

      
      if(messageType === MessageCategory.MESSAGE && webHookBody.entry[0].changes[0].value.messages){
      
        const phoneNumber: string = webHookBody.entry[0].changes[0].value.messages[0]["from"];
        const msg_body: string = webHookBody.entry[0].changes[0].value.messages[0]["text"]["body"];
      
        console.log(msg_body);

        console.log(phoneNumber);
  
        console.log("sending main menu!");

        let method: string = 'homeMenu';
        
        console.log(method);

        const response: string[] = this.menuService.menuRunner(method, phoneNumber, msg_body);

        method = response[0];

        console.log(method);

        console.log(response[1]);

        if(response[0] === 'familyTree'){
          await this.appService.sendMessage(response[1], process.env.to, true);
        }
        else{
          await this.appService.sendMessage(response[1], process.env.to);
        }
        
      }
    console.log("------------------------end----------------------------");
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(200);
    }

  }
}
