import QS from 'query-string';

import {LarkAPI, PageResponseData} from '../@api';
import {DataResponse} from '../../client';

export interface BotGroupCreateOptions {
  name?: string;
  description?: string;
  open_ids?: string[];
  user_ids?: string[];
  i18n_names?: {[key: string]: string};
  only_owner_add?: boolean;
  share_allowed?: boolean;
  only_owner_at_all?: boolean;
  only_owner_edit?: boolean;
}

export interface BotGroupCreateData {
  chat_id: string;
  invalid_open_ids: string[];
  invalid_user_ids: string[];
}

export interface BotGroupEntry {
  avatar: string;
  description: string;
  chat_id: string;
  name: string;
  owner_open_id: string;
  owner_user_id?: string;
}

export interface BotGroupListData extends PageResponseData {
  groups: BotGroupEntry[];
}

export interface BotGroupMemberRef {
  open_id: string;
  user_id: string;
}

export interface BotGroupInfoData extends BotGroupEntry {
  i18n_names?: {[key: string]: string};
  members: BotGroupMemberRef[];
  type: 'group' | 'p2p';
}

export interface BotGroupUpdateInfoOptions {
  chat_id: string;
  owner_open_id?: string;
  owner_user_id?: string;
  name?: string;
  i18n_names?: {[key: string]: string};
  only_owner_add?: boolean;
  share_allowed?: boolean;
  only_owner_at_all?: boolean;
  only_owner_edit?: boolean;
}

export interface BotGroupUpdateInfoData {
  chat_id: string;
}

export interface BotGroupAddMembersOptions {
  chat_id: string;
  user_ids?: string[];
  open_ids?: string[];
}

export interface BotGroupAddMembersData {
  invalid_open_ids: string[];
  invalid_user_ids: string[];
}

export interface BotGroupDeleteMembersOptions {
  chat_id: string;
  user_ids?: string[];
  open_ids?: string[];
}

export interface BotGroupDeleteMembersData {
  invalid_open_ids: string[];
  invalid_user_ids: string[];
}

export class BotGroupAPI extends LarkAPI {
  async create(options: BotGroupCreateOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.post<DataResponse<BotGroupCreateData>>(
      'chat/v4/create/',
      options,
      tenant_access_token,
    );
  }

  async getList(pageSize = 100, pageToken?: string) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify({page_size: pageSize, page_token: pageToken});

    return this.client.get<DataResponse<BotGroupListData>>(
      `chat/v4/list?${query}`,
      tenant_access_token,
    );
  }

  async getInfo(chatId: string) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify({chat_id: chatId});

    return this.client.get<DataResponse<BotGroupInfoData>>(
      `chat/v4/info?${query}`,
      tenant_access_token,
    );
  }

  async updateInfo(options: BotGroupUpdateInfoOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.post<DataResponse<BotGroupUpdateInfoData>>(
      'chat/v4/update/',
      options,
      tenant_access_token,
    );
  }

  async addMembers(options: BotGroupAddMembersOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.post<DataResponse<BotGroupAddMembersData>>(
      'chat/v4/chatter/add/',
      options,
      tenant_access_token,
    );
  }

  async deleteMembers(options: BotGroupDeleteMembersOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.post<DataResponse<BotGroupDeleteMembersData>>(
      'chat/v4/chatter/delete/',
      options,
      tenant_access_token,
    );
  }

  async disband(chatId: string) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let data = {chat_id: chatId};

    await this.client.post('chat/v4/disband', data, tenant_access_token);
  }
}
