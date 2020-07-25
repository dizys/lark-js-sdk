import {LarkAPI} from './@api';
import {DataResponse} from '../client';

export interface AuthenUserIdentityData {
  access_token: string;
  avatar_url: string;
  avatar_thumb: string;
  avatar_middle: string;
  avatar_big: string;
  expires_in: number;
  name: string;
  en_name: string;
  open_id: string;
  tenant_key: string;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface AuthenUserInfoData {
  name: string;
  avatar_url: string;
  avatar_thumb: string;
  avatar_middle: string;
  avatar_big: string;
  email: string;
  user_id: string;
  mobile: string;
}

export type refreshUserAccessTokenData = AuthenUserIdentityData;

export class AuthenAPI extends LarkAPI {
  getUserVerificationURL(redirectURL: string, state?: string) {
    redirectURL = encodeURIComponent(redirectURL);
    state = state ? encodeURIComponent(state) : undefined;
    let appId = encodeURIComponent(this.client.appId);

    return `${
      this.client.apiEndpoint
    }authen/v1/index?redirect_uri=${redirectURL}&app_id=${appId}${
      state ? `&state=${state}` : ''
    }`;
  }

  async getUserIdentity(code: string) {
    let app_access_token = await this.client.getAppAccessToken();

    let data = {app_access_token, grant_type: 'authorization_code', code};

    return this.client.post<DataResponse<AuthenUserIdentityData>>(
      'authen/v1/access_token',
      data,
    );
  }

  async getUserInfo(userAccessToken: string) {
    return this.client.get<DataResponse<AuthenUserInfoData>>(
      'authen/v1/user_info',
      userAccessToken,
    );
  }

  async refreshUserAccessToken(userAccessToken: string) {
    let app_access_token = await this.client.getAppAccessToken();

    let data = {
      app_access_token,
      grant_type: 'refresh_token',
      refresh_token: userAccessToken,
    };

    return this.client.post<DataResponse<refreshUserAccessTokenData>>(
      'authen/v1/refresh_access_token',
      data,
    );
  }
}
