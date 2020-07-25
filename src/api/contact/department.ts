import {LarkAPI, PageResponseData} from '../@api';
import {DataResponse} from '../../client';
import QS from 'query-string';

export enum ContactDepartmentStatus {
  invalid = 0,
  valid = 1,
}

export interface ContactDepartmentInfo {
  id: string;
  name: string;
  chat_id?: string;
  member_count: number;
  parent_id: string;
  status: ContactDepartmentStatus;
  leader_employee_id?: string;
  leader_open_id?: string;
}

export interface ContactDepartmentInfoData {
  department_info: ContactDepartmentInfo;
}

export interface ContactDepartmentSubDepartmentsOptions {
  department_id: string;
  page_token?: string;
  page_size: number;
  fetch_child?: boolean;
}

export interface ContactDepartmentSubDepartmentInfo {
  id: string;
  name: string;
  parent_id: string;
}

export interface ContactDepartmentSubDepartmentsData extends PageResponseData {
  department_infos: ContactDepartmentSubDepartmentInfo[];
}

export interface ContactDepartmentInfosData {
  department_infos: ContactDepartmentInfo[];
}

export interface ContactDepartmentAddOptions {
  name: string;
  parent_id?: string;
  parent_open_department_id?: string;
  id?: string;
  leader_employee_id?: string;
  leader_open_id?: string;
  create_group_chat?: boolean;
}

export interface ContactDepartmentInfoWithOpenIds {
  open_department_id: string;
  parent_open_department_id: string;
}

export interface ContactDepartmentAddData {
  department_info: ContactDepartmentInfoWithOpenIds;
}

export interface ContactDepartmentUpdateInfoOptions {
  name?: string;
  parent_id?: string;
  id: string;
  leader_employee_id?: string;
  leader_open_id?: string;
  create_group_chat?: boolean;
}

export interface ContactDepartmentUpdateInfoData {
  department_info: ContactDepartmentInfo;
}

export class ContactDepartmentAPI extends LarkAPI {
  async getInfo(departmentId: string) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify({department_id: departmentId});

    return this.client.get<DataResponse<ContactDepartmentInfoData>>(
      `contact/v1/department/info/get?${query}`,
      tenant_access_token,
    );
  }

  async getSubDepartments(options: ContactDepartmentSubDepartmentsOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify(options);

    return this.client.get<DataResponse<ContactDepartmentSubDepartmentsData>>(
      `contact/v1/department/simple/list?${query}`,
      tenant_access_token,
    );
  }

  async getInfos(departmentIds: string[]) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = departmentIds
      .map(departmentId => `department_ids=${encodeURIComponent(departmentId)}`)
      .join('&');

    return this.client.get<DataResponse<ContactDepartmentInfosData>>(
      `contact/v1/department/detail/batch_get?${query}`,
      tenant_access_token,
    );
  }

  async add(options: ContactDepartmentAddOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.post<DataResponse<ContactDepartmentAddData>>(
      'contact/v1/department/add',
      options,
      tenant_access_token,
    );
  }

  async delete(id: string) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let data = {id};

    await this.client.post(
      'contact/v1/department/delete',
      data,
      tenant_access_token,
    );
  }

  async updateInfo(options: ContactDepartmentUpdateInfoOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.post<DataResponse<ContactDepartmentUpdateInfoData>>(
      'contact/v1/department/update',
      options,
      tenant_access_token,
    );
  }
}
