import { Controller, Get, Query, Res, Post, Req, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import axios from 'axios';
import { WebhookDto } from './app.dto';

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
  ){
    // Parse the request body from the POST
  let body: any = req.body;

  // Check the Incoming webhook message
  //console.log(JSON.stringify(req.body));
  console.log("Incoming webhook with dto implementation!");
  console.log(JSON.stringify(webHookBody));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      const entry = req.body.entry[0]
      const change = entry.changes[0]
      const { messages } = change.value
      // console.log('change value is',change.value)
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
       // console.log({msg_body,from,phone_number_id,entry,field,messages})
       await axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          `https://graph.facebook.com/v18.0/${process.env.fromNumberID}/messages`,
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: process.env.to,
          type: "text",
          text: { body: `Echo:\n${from}\n${msg_body}` },
        },
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.authToken}`
        },
      });
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }    
  }
}
