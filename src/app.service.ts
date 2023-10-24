import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getVerified(mode: string, verify_token: string): boolean{
    if(mode === 'subscribe' && process.env.token === verify_token) {
      console.log("WEBHOOK_VERIFIED");
      return true;
    }
    return false;
  }

  /**
   * 1. response or send whatsapp message to the user
   * 2. detect based off the request that this is a message from the user and echo it back
   * 3. detect based off the request that this is a sent message notification
   * 4. detect based off the request that this is a delivered message notification
   * 5. detect based off the request that this is a read message notification
   * */ 
}
