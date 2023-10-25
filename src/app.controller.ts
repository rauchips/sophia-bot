import { Controller, Get, Query, Res, Post, Req, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import axios, { HttpStatusCode } from 'axios';
import { MessageCategory, WebhookDto } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
      
        const msg_body = webHookBody.entry[0].changes[0].value.messages[0]["text"]["body"];
      
        console.log(msg_body);
        console.log("----------------------------------------------------");
  
        //if(msg_body === "Hi Sophia"){
        console.log("sending main menu!");
        await this.appService.sendMessage(msg_body, process.env.to);
        //}
      }
    console.log("------------------------end----------------------------");
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(200);
    }

  }
}
