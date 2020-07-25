import QS from 'query-string';
import {LarkAPI} from '../@api';
import {DataResponse} from '../../client';

import {ContactUserAddOptions} from './user';
import {ContactDepartmentAddOptions} from './department';

export interface ContactBatchTaskData {
  task_id: string;
}

export enum ContactBatchTaskAction {
  add = 1,
  update = 2,
}

export interface ContactBatchTaskInfoBase {
  code: string;
  msg: string;
  action?: ContactBatchTaskAction;
  name: string;
}

export interface ContactBatchAddUsersTaskInfo extends ContactBatchTaskInfoBase {
  email: string;
  mobile: string;
  user_id: string;
  departments: string[];
  open_id?: string;
}

export interface ContactBatchAddDepartmentsTaskInfo
  extends ContactBatchTaskInfoBase {
  department_id: string;
  parent_id: string;
  chat_id?: string;
}

export interface _ContactBatchTaskStatusData<Type = string, TaskInfo = any> {
  task_id: string;
  type: Type;
  status: number;
  progress: number;
  total_num: number;
  success_num: number;
  fail_num: number;
  create_time: number;
  finish_time: number;
  task_info?: TaskInfo[];
}

export type ContactBatchAddUsersTaskStatusData = _ContactBatchTaskStatusData<
  'add_user',
  ContactBatchAddUsersTaskInfo
>;

export type ContactBatchAddDepartmentsTaskStatusData = _ContactBatchTaskStatusData<
  'add_department',
  ContactBatchAddDepartmentsTaskInfo
>;

export type ContactBatchTaskStatusData =
  | ContactBatchAddUsersTaskStatusData
  | ContactBatchAddDepartmentsTaskStatusData;

export class ContactBatchAPI extends LarkAPI {
  async addDepartments(departments: ContactDepartmentAddOptions[]) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let data = {departments};

    return this.client.post<DataResponse<ContactBatchTaskData>>(
      'contact/v2/department/batch_add',
      data,
      tenant_access_token,
    );
  }

  async addUsers(users: ContactUserAddOptions[], sendNotification = false) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let data = {users, need_send_notification: sendNotification};

    return this.client.post<DataResponse<ContactBatchTaskData>>(
      'contact/v2/user/batch_add',
      data,
      tenant_access_token,
    );
  }

  async getTaskStatus(taskId: string) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify({task_id: taskId});

    return this.client.get<DataResponse<ContactBatchTaskStatusData>>(
      `contact/v2/task/get?${query}`,
      tenant_access_token,
    );
  }
}
