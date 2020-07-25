import {LarkAPI, PageResponseData} from '../@api';
import {DataResponse} from '../../client';
import QS from 'query-string';

export interface ContactUserRefWithEmployeeIdOnly {
  employee_id: string;
}

export interface ContactUserRefWithOpenIdOnly {
  open_id: string;
}

export interface ContactUserRefWithBoth {
  employee_id: string;
  open_id: string;
}

export type ContactUserRef =
  | ContactUserRefWithEmployeeIdOnly
  | ContactUserRefWithOpenIdOnly
  | ContactUserRefWithBoth;

export enum EmployeeType {
  fulltime = 1,
  intern = 2,
  outsourced = 3,
  labor = 4,
  consultant = 5,
}

export enum Gender {
  male = 1,
  female = 2,
}

export interface ContactUserInfo<CustomAttrs = any> {
  name: string;
  name_py: string;
  en_name: string;
  employee_id: string;
  employee_no: string;
  open_id: string;
  union_id: string;
  status: number;
  employee_type: EmployeeType;
  avatar_72: string;
  avatar_240: string;
  avatar_640: string;
  avatar_url: string;
  gender: Gender;
  email: string;
  mobile: string;
  description: string;
  country: string;
  city: string;
  work_station: string;
  is_tenant_manager: boolean;
  join_time?: number;
  update_time: number;
  leader_employee_id?: string;
  leader_open_id: string;
  leader_union_id?: string;
  departments: string[];
  open_departments: string[];
  custom_attrs?: CustomAttrs;
}

export interface ContactUserInfosData {
  user_infos: ContactUserInfo[];
}

export interface ContactUserBriefInfo {
  employee_id: string;
  open_id: string;
  name: string;
  employee_no: string;
  union_id: string;
}

export interface ContactDepartmentUserListOptions {
  idType: 'department_id' | 'open_department_id';
  id: string;
  page_size: number;
  page_token?: string;
  fetch_child: boolean;
}

export interface ContactDepartmentUserListData extends PageResponseData {
  user_list: ContactUserBriefInfo[];
}

export interface ContactDepartmentUserDetailListOptions {
  idType: 'department_id' | 'open_department_id';
  id: string;
  page_size: number;
  page_token?: string;
  fetch_child: boolean;
}

export interface ContactDepartmentUserDetailListData extends PageResponseData {
  user_list: ContactUserInfo[];
}

export interface ContactUserAddOptions<CustomAttrs = any> {
  name: string;
  email?: string;
  mobile: string;
  department_ids: string[];
  mobile_visible?: boolean;
  city?: string;
  country?: string;
  gender?: Gender;
  employee_type?: EmployeeType;
  join_time?: number;
  leader_employee_id?: string;
  leader_open_id?: string;
  employee_id?: string;
  employee_no?: string;
  need_send_notification?: boolean;
  custom_attrs?: CustomAttrs;
  work_station?: string;
}

export interface ContactUserAddData {
  user_info: ContactUserInfo;
}

export interface ContactUserDeleteOptions {
  employee_id?: string;
  open_id?: string;
  department_chat_acceptor?: ContactUserRef;
  external_chat_acceptor?: ContactUserRef;
  docs_acceptor?: ContactUserRef;
  calendar_acceptor?: ContactUserRef;
  application_acceptor?: ContactUserRef;
}

export interface ContactUserUpdateOptionsWithEmployeeIdOnly
  extends Partial<ContactUserInfo> {
  employee_id: string;
}

export interface ContactUserUpdateOptionsWithOpenIdOnly
  extends Partial<ContactUserInfo> {
  open_id: string;
}

export type ContactUserUpdateOptions =
  | ContactUserUpdateOptionsWithEmployeeIdOnly
  | ContactUserUpdateOptionsWithOpenIdOnly;

export interface ContactRole {
  id: string;
  name: string;
}

export interface ContactRoleListData {
  role_list: ContactRole[];
}

export interface ContactRoleMemberEntry {
  name: string;
  open_id: string;
  user_id: string;
}

export interface ContactRoleMembersData extends PageResponseData {
  user_list: ContactRoleMemberEntry[];
}

export interface ContactUserIdsByMobilesOrEmailsOptions {
  mobiles?: string[];
  emails?: string[];
}

export interface ContactUserIdEntry {
  open_id: string;
  user_id: string;
}

export interface ContactUserIdsByMobilesOrEmailsData {
  email_users: {[key: string]: ContactUserIdEntry[]};
  emails_not_exist: string[];
  mobile_users: {[key: string]: ContactUserIdEntry[]};
  mobiles_not_exist: string[];
}

export interface ContactUserIdsByUnionIdsData {
  user_infos: {[key: string]: ContactUserIdEntry};
}

export interface ContactUserSearchEntry {
  avatar: {
    avatar_72: string;
    avatar_240: string;
    avatar_640: string;
    avatar_origin: string;
  };
  department_ids: string[];
  name: string;
  open_id: string;
  user_id: string;
}

export interface ContactUserSearchData extends PageResponseData {
  users: ContactUserSearchEntry[];
}

export class ContactUserAPI extends LarkAPI {
  async getInfos(idsType: 'open_ids' | 'employee_ids', ids: string[]) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = ids.map(id => `${idsType}=${encodeURIComponent(id)}`).join('&');

    await this.client.get<DataResponse<ContactUserInfo>>(
      `contact/v1/user/batch_get?${query}`,
      tenant_access_token,
    );
  }

  async getDepartmentUserList(options: ContactDepartmentUserListOptions) {
    let {idType, id, ...restOptions} = options;

    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify({[idType]: id, ...restOptions});

    return await this.client.get<DataResponse<ContactDepartmentUserListData>>(
      `contact/v1/department/user/list?${query}`,
      tenant_access_token,
    );
  }

  async getDepartmentUserDetailList(
    options: ContactDepartmentUserDetailListOptions,
  ) {
    let {idType, id, ...restOptions} = options;

    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify({[idType]: id, ...restOptions});

    return await this.client.get<
      DataResponse<ContactDepartmentUserDetailListData>
    >(`contact/v1/department/user/detail/list?${query}`, tenant_access_token);
  }

  async add(options: ContactUserAddOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.post<DataResponse<ContactUserAddData>>(
      'contact/v1/user/add',
      options,
      tenant_access_token,
    );
  }

  async delete(options: ContactUserDeleteOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    await this.client.post(
      'contact/v1/user/delete',
      options,
      tenant_access_token,
    );
  }

  async update(options: ContactUserUpdateOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    await this.client.post(
      'contact/v1/user/update',
      options,
      tenant_access_token,
    );
  }

  async getRoleList() {
    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.get<DataResponse<ContactRoleListData>>(
      'contact/v2/role/list',
      tenant_access_token,
    );
  }

  async getRoleMembers(roleId: string, pageSize = 20, pageToken?: string) {
    let query = QS.stringify({
      role_id: roleId,
      page_size: pageSize,
      page_token: pageToken,
    });

    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.get<DataResponse<ContactRoleMembersData>>(
      `contact/v2/role/members?${query}`,
      tenant_access_token,
    );
  }

  async getUserIdsByMobilesOrEmails(
    options: ContactUserIdsByMobilesOrEmailsOptions,
  ) {
    let {emails = [], mobiles = []} = options;

    let tenant_access_token = await this.client.getTenantAccessToken();

    let emailQueries = emails.map(
      email => `emails=${encodeURIComponent(email)}`,
    );
    let mobileQueries = mobiles.map(
      mobile => `mobiles=${encodeURIComponent(mobile)}`,
    );
    let query = emailQueries.concat(mobileQueries).join('&');

    return this.client.get<DataResponse<ContactUserIdsByMobilesOrEmailsData>>(
      `user/v1/batch_get_id?${query}`,
      tenant_access_token,
    );
  }

  async getUserIdsByUnionIds(unionIds: string[]) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = unionIds
      .map(unionId => `union_ids=${encodeURIComponent(unionId)}`)
      .join('&');

    return this.client.get<DataResponse<ContactUserIdsByUnionIdsData>>(
      `user/v1/union_id/batch_get/list?${query}`,
      tenant_access_token,
    );
  }

  async search(query: string, pageSize = 20, pageToken?: string) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let _query = QS.stringify({
      query,
      page_size: pageSize,
      page_token: pageToken,
    });

    return this.client.get<DataResponse<ContactUserSearchData>>(
      `search/v1/user?${_query}`,
      tenant_access_token,
    );
  }
}
