import { Logger, Injectable } from '@nestjs/common';
import axios from 'axios';
import { MessageCategory, WebhookDto } from './app.dto';
import * as https from 'https';

@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger(AppService.name);

  getVerified(mode: string, verify_token: string): boolean {
    try {
      if (mode === 'subscribe' && process.env.token === verify_token) {
        this.logger.log('WEBHOOK_VERIFIED');
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(error.message);
    }
  }
  /**
   * Check message type
   * @param { string } message_id
   * @returns { Promise<void> }
   */
  async blueTick(message_id: string): Promise<void> {
    try {
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

      this.logger.log(`BlueTick Sent: ${message_id} `);
    } catch (error) {
      this.logger.error(error.message);
    }
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
    try {
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
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  /**
   * Check message type
   * @param {WebhookDto} webHookDto
   * @returns {MessageCategory}
   */
  findMessageType(webHookDto: WebhookDto): MessageCategory {
    try {
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
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  /**
   * Fetch customer profile from Sophia Core Service
   * @param { string } profileName
   * @returns { Promise<string[]> }
   */
  async fetchProfile(profileName: string): Promise<object> {
    try {
      const agent = new https.Agent({
        requestCert: true,
        rejectUnauthorized: false,
      });

      this.logger.log(`Fetching profile for ${profileName}`);

      const response = await axios({
        method: 'POST', // Required, HTTP method, a string, e.g. POST, GET
        url: 'https://sophia-core-txw28.ondigitalocean.app/api/v1/user/profile',
        data: {
          Username: profileName,
        },
        httpsAgent: agent,
      });

      if (response.status == 200) {
        const status: string = response.data.status;
        const message: string = response.data.message;
        const data: object = response.data.data;

        if (status == '200') {
          this.logger.log(`Profile Details: ${JSON.stringify(data)}`);

          return data;
        } else {
          this.logger.log(`Profile Not Found: null`);

          return null;
        }
      }
    } catch (error) {
      this.logger.error(error.message);

      return null;
    }
  }
}
