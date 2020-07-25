import {LarkAPI} from './@api';

export interface NotifyAppNotifyOptions {
  open_id?: string;
  user_id?: string;
  notify_content: string;
  i18n_notify_content?: {[key: string]: string};
  pc_schema?: {
    path?: string;
    query?: string;
  };
  ios_schema?: {
    path?: string;
    query?: string;
  };
  android_schema?: {
    path?: string;
    query?: string;
  };
}

export class NotifyAPI extends LarkAPI {
  async appNotify(options: NotifyAppNotifyOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    await this.client.post('notify/v4/appnotify', options, tenant_access_token);
  }
}
