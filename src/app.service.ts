import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { MessageCategory, WebhookDto } from './app.dto';

@Injectable()
export class AppService {
  getVerified(mode: string, verify_token: string): boolean{
    if(mode === 'subscribe' && process.env.token === verify_token) {
      console.log("WEBHOOK_VERIFIED");
      return true;
    }
    return false;
  }

  async sendMessage(message: string, to: string, url: boolean = false){
    await axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url:
        `https://graph.facebook.com/v18.0/${process.env.fromNumberID}/messages`,
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "text",
        text: {
          preview_url: url,
          body: message 
        },
      },
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.authToken}`
      },
    });
  }

  findMessageType(webHookDto: WebhookDto): MessageCategory{

    let value = webHookDto.entry[0].changes[0].value;
    
    if(value.contacts && value.messages){

      console.log(MessageCategory.MESSAGE);
      
      return MessageCategory.MESSAGE;

    }else if(value.statuses[0]["status"] === "sent"){
      
      console.log(MessageCategory.SENT);
      
      return MessageCategory.SENT;

    }else if(value.statuses[0]["status"] === "delivered"){
      
      console.log(MessageCategory.DELIVERED);
      
      return MessageCategory.DELIVERED;

    }else if(value.statuses[0]["status"] === "read"){
      
      console.log(MessageCategory.READ);
      
      return MessageCategory.READ;
    }
  }
 /**
   * 1. response or send whatsapp message to the user - DONE
   * 2. detect based off the request that this is a message from the user and echo it back
   * 3. detect based off the request that this is a sent message notification - DONE
   * 4. detect based off the request that this is a delivered message notification - DONE
   * 5. detect based off the request that this is a read message notification - DONE
   * */ 









/**
 * // Parse the request body from the POST
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
       if(msg_body && msg_body === "Hi Sophia"){
        console.log("sending main menu!");
        //AXIOS
       }
       
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }    
 */


 
}
