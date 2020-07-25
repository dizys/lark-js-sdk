import QS from 'query-string';
import {LarkAPI, PageResponseData} from './@api';
import {DataResponse} from '../client';

export interface UserGroupInfo {
  avatar: string;
  description: string;
  chat_id: string;
  name: string;
  owner_open_id: string;
  owner_user_id?: string;
}

export interface UserGroupListData extends PageResponseData {
  groups: UserGroupInfo[];
}

export interface UserGroupMemberEntry {
  name: string;
  open_id: string;
  user_id: string;
}

export interface UserGroupMembersData extends PageResponseData {
  members: UserGroupMemberEntry[];
}

export interface UserGroupSearchData extends PageResponseData {
  groups: UserGroupInfo[];
}

export class UserGroupAPI extends LarkAPI {
  async getList(userAccessToken: string, pageSize = 100, pageToken?: string) {
    let query = QS.stringify({page_size: pageSize, page_token: pageToken});

    return this.client.get<DataResponse<UserGroupListData>>(
      `user/v4/group_list?${query}`,
      userAccessToken,
    );
  }

  async getMembers(
    userAccessToken: string,
    chatId: string,
    pageSize = 100,
    pageToken?: string,
  ) {
    let query = QS.stringify({
      chat_id: chatId,
      page_size: pageSize,
      page_token: pageToken,
    });

    return this.client.get<DataResponse<UserGroupMembersData>>(
      `chat/v4/members?${query}`,
      userAccessToken,
    );
  }

  async search(
    userAccessToken: string,
    query: string,
    pageSize = 100,
    pageToken?: string,
  ) {
    let _query = QS.stringify({
      query: query,
      page_size: pageSize,
      page_token: pageToken,
    });

    return this.client.get<DataResponse<UserGroupSearchData>>(
      `chat/v4/search?${_query}`,
      userAccessToken,
    );
  }
}
