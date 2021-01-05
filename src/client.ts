import Axios, {AxiosResponse} from 'axios';

const TOKEN_RENEW_TIME_AHEAD = 120;

export interface AppAccessTokenResponse {
  app_access_token: string;
  expire: number;
}

export interface TenantAccessTokenResponse {
  tenant_access_token: string;
  expire: number;
}

export class LarkAPIError extends Error {
  constructor(private code: number, message: string) {
    super(message);
  }
}

export type DownloadResponseType = 'arraybuffer' | 'blob' | 'stream';

export class LarkAPIClient {
  appAccessToken: string | undefined;
  private appAccessTokenExpires: number | undefined;

  tenantAccessToken: string | undefined;
  private tenantAccessTokenExpires: number | undefined;

  appTicket: string | undefined;
  tenantKey: string | undefined;

  constructor(
    public appId: string,
    public appSecret: string,
    public apiEndpoint: string,
    public internal = true,
  ) {}

  get appBaseCredentials() {
    return {app_id: this.appId, app_secret: this.appSecret};
  }

  private async fetchAppAccessToken() {
    let data = this.internal
      ? this.appBaseCredentials
      : {...this.appBaseCredentials, app_ticket: this.appTicket};

    let {app_access_token, expire} = await this.post<AppAccessTokenResponse>(
      `auth/v3/app_access_token/${this.internal ? 'internal/' : ''}`,
      data,
    );

    this.appAccessToken = app_access_token;
    this.appAccessTokenExpires =
      Date.now() + expire * 1000 - TOKEN_RENEW_TIME_AHEAD * 1000;
  }

  async getAppAccessToken() {
    let expired =
      this.appAccessTokenExpires && Date.now() > this.appAccessTokenExpires;

    if (!this.appAccessToken || expired) {
      await this.fetchAppAccessToken();
    }

    return this.appAccessToken;
  }

  private async fetchTenantAccessToken() {
    let data = this.internal
      ? this.appBaseCredentials
      : {
          app_access_token: await this.getAppAccessToken(),
          tenant_key: this.tenantKey,
        };

    let {tenant_access_token, expire} = await this.post<
      TenantAccessTokenResponse
    >(`auth/v3/tenant_access_token/${this.internal ? 'internal/' : ''}`, data);

    this.tenantAccessToken = tenant_access_token;
    this.tenantAccessTokenExpires =
      Date.now() + expire * 1000 - TOKEN_RENEW_TIME_AHEAD * 1000;
  }

  async getTenantAccessToken() {
    let expired =
      this.tenantAccessTokenExpires &&
      Date.now() > this.tenantAccessTokenExpires;

    if (!this.tenantAccessToken || expired) {
      await this.fetchTenantAccessToken();
    }

    return this.tenantAccessToken;
  }

  async get<T = any>(path: string, accessToken?: string) {
    let response = await Axios.get(`${this.apiEndpoint}${path}`, {
      headers: {Authorization: `Bearer ${accessToken}`},
    });
    return handleResponse<T>(response);
  }

  async post<T = any>(path: string, data: any, accessToken?: string) {
    let response = await Axios.post(`${this.apiEndpoint}${path}`, data, {
      headers: {Authorization: `Bearer ${accessToken}`},
    });
    return handleResponse<T>(response);
  }

  async postFormData<T = any>(
    path: string,
    formData: any,
    accessToken?: string,
  ) {
    let response = await Axios.post(`${this.apiEndpoint}${path}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    });
    return handleResponse<T>(response);
  }

  async download(
    path: string,
    responseType: DownloadResponseType,
    accessToken?: string,
  ) {
    let response = await Axios.get(`${this.apiEndpoint}${path}`, {
      responseType,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  }
}

type _GetDataOfOutType<T> = T extends {data: any} ? T['data'] : T;

export interface DataResponse<Data> {
  data: Data;
}

async function handleResponse<T>(
  response: AxiosResponse,
): Promise<_GetDataOfOutType<T>> {
  let {data} = response;

  if (!data || typeof data !== 'object' || !('code' in data)) {
    throw new LarkAPIError(500, 'Unknown error');
  }

  let {code, msg} = data;

  if (code !== 0) {
    throw new LarkAPIError(code, msg);
  }

  if ('data' in data) {
    return data.data;
  }

  return data;
}
