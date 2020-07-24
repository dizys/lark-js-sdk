import {LarkAPI} from '../@api';
import {DataResponse} from '../../client';
import QS from 'query-string';

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

export interface ContactDepartmentUserListData {
  has_more: boolean;
  page_token: string;
  user_list: ContactUserBriefInfo[];
}

export interface ContactDepartmentUserDetailListOptions {
  idType: 'department_id' | 'open_department_id';
  id: string;
  page_size: number;
  page_token?: string;
  fetch_child: boolean;
}

export interface ContactDepartmentUserDetailListData {
  has_more: boolean;
  page_token: string;
  user_list: ContactUserInfo[];
}

export class ContactUserAPI extends LarkAPI {
  async getUserInfos(idsType: 'open_ids' | 'employee_ids', ids: string[]) {
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
}
