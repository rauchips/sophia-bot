import { Controller, Get, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/webhook')
  getVerified(
    @Query() query: object,
    @Res() res: Response,
  ): Response {
    console.log(query);
    console.log(query["hub.mode"]);

    const token = "meatyhamhock";
    const mode: string = query["hub.mode"];
    const challenge: string = query["hub.challenge"];
    const verify_token: string = query["hub.verify_token"];

    if(mode === 'subscribe' && token === verify_token) {
      console.log("WEBHOOK_VERIFIED");
      return res.status(200).send(challenge);
    }
    
    return res.status(400).send(new Error('Error occured.'));
    
  }
}
