import { Injectable } from '@nestjs/common';
import * as https from 'https';
import axios from 'axios';

@Injectable()
export class ProfileService {
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
  
      const response = await axios({
        method: 'POST', // Required, HTTP method, a string, e.g. POST, GET
        url: 'https://localhost:7135/user/profile',
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
          return data;
        } else {
          return null;
        }
      } 
    } catch (error) {
      return null;
    }
  }
}
