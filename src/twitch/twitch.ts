import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import TwitchJs, { Api } from 'twitch-js';

export class Twitch {
  private api: Api;
  constructor(private readonly configService: ConfigService) {
    console.log('Twitch instantiated');
    this.createAPI();
  }

  private async getAccessToken(): Promise<string> {
    console.log('Getting access token');

    const url = 'https://id.twitch.tv/oauth2/token';

    const clientID = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({
      client_id: clientID,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    });

    const { data } = await axios.post(url, body, config);
    return data.access_token;
  }

  private async createAPI(): Promise<Api> {
    const clientID = this.configService.get<string>('CLIENT_ID');
    const accessToken = await this.getAccessToken();

    const { api } = new TwitchJs({ token: accessToken, clientId: clientID });
    this.api = api;
    return api;
  }

  public async getLivestreamInfo(userId: string): Promise<any> {
    const { data } = await this.api.get('streams', {
      search: { user_id: userId},
    });
    return data[0];
  }

  public async getStreams(): Promise<any> {
    const { data } = await this.api.get('streams', {});
    return data;
  }
}
