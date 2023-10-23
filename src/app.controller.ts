import { Controller, Get, Query, Res, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { createBot } from 'whatsapp-cloud-api';
import axios, { HttpStatusCode } from 'axios';

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

  @Post('/webhook')
  async  postMessage(
    @Res() res: Response,
    @Req() req: Request,
  ){
    // Parse the request body from the POST
  let body: any = req.body;

  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body));

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
          "https://graph.facebook.com/v18.0/149350494925771/messages",
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: "254701093842",
          type: "text",
          text: { body: `Echo: ${from}---------------${msg_body}` },
        },
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer EAAMbz96jR5sBOzxvwFa8e37y7427oDTQBky1EbXZCyiwqGqoGUC7lW53GSx5qXTZBZCoTYXKKge1uMHn53KCYrR9T9EUgDs1feaN0R7znjQGvfNZCEz5LahEUkp1k8zim5fYJsCRNoI6SIHGGROAjRZA8jwXcOyEiiOCtjCZCvwudsgQbW2BXx5jzBF07NnjbxMLFwt5MaP3evKIeDZBWgZD"
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
