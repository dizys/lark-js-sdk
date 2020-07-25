import {LarkAPI} from '../@api';

export interface BotManageInfo {
  activate_status: number;
  app_name: string;
  avatar_url: string;
  ip_white_list: string[];
  open_id: string;
}

export interface BotManageInfoData {
  bot: BotManageInfo;
}

export class BotManageAPI extends LarkAPI {
  async getInfo() {
    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.get<BotManageInfoData>(
      'bot/v3/info/',
      tenant_access_token,
    );
  }

  async addToGroup(chatId: string) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let data = {chat_id: chatId};

    await this.client.post('bot/v4/add', data, tenant_access_token);
  }

  async removeFromGroup(chatId: string) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let data = {chat_id: chatId};

    await this.client.post('bot/v4/remove', data, tenant_access_token);
  }
}
