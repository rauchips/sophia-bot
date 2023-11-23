import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { MessageCategory, WebhookDto } from './app.dto';

@Injectable()
export class AppService {
  getVerified(mode: string, verify_token: string): boolean {
    if (mode === 'subscribe' && process.env.token === verify_token) {
      console.log('WEBHOOK_VERIFIED');
      return true;
    }
    return false;
  }
  /**
   * Check message type
   * @param { string } message_id
   * @returns { Promise<void> }
   */
  async blueTick(message_id: string): Promise<void> {
    await axios({
      method: 'POST', // Required, HTTP method, a string, e.g. POST, GET
      url: `https://graph.facebook.com/v18.0/${process.env.fromNumberID}/messages`,
      data: {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.authToken}`,
      },
    });
  }

  /**
   * Check message type
   * @param { string } message
   * @param { string } to
   * @param { boolean } url
   * @returns { Promise<void> }
   */
  async sendMessage(
    message: string,
    to: string,
    url: boolean = false,
  ): Promise<void> {
    await axios({
      method: 'POST', // Required, HTTP method, a string, e.g. POST, GET
      url: `https://graph.facebook.com/v18.0/${process.env.fromNumberID}/messages`,
      data: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: {
          preview_url: url,
          body: message,
        },
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.authToken}`,
      },
    });
  }

  /**
   * Check message type
   * @param {WebhookDto} webHookDto
   * @returns {MessageCategory}
   */
  findMessageType(webHookDto: WebhookDto): MessageCategory {
    const value = webHookDto.entry[0].changes[0].value;

    if (value.contacts && value.messages) {
      return MessageCategory.MESSAGE;
    } else if (value.statuses[0]['status'] === 'sent') {
      return MessageCategory.SENT;
    } else if (value.statuses[0]['status'] === 'delivered') {
      return MessageCategory.DELIVERED;
    } else if (value.statuses[0]['status'] === 'read') {
      return MessageCategory.READ;
    }
  }
}
