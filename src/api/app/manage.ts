import QS from 'query-string';
import {LarkAPI} from '../@api';
import {DataResponse} from '../../client';

export enum AppManageBoolean {
  false = 0,
  true = 1,
}

export interface AppManagePageResponseData {
  page_token: string;
  page_size: number;
  total_count: number;
  has_more: AppManageBoolean;
}

export interface AppManageIsUserAdminData {
  is_app_admin: boolean;
}

export interface AppManageUserAdminScopeData {
  is_all: boolean;
  department_list: string[];
}

export interface AppManageAppVisibilityUserEntry {
  open_id: string;
  user_id?: string;
}

export interface AppManageAppVisibilityData {
  departments: {id: string}[];
  users: [];
  is_visible_to_all: AppManageBoolean;
  has_more_users: AppManageBoolean;
  user_page_token: string;
  total_user_count: number;
}

export interface AppManageUserVisibleAppsOptions {
  id_type: 'open_id' | 'user_id';
  id: string;
  lang?: string;
  page_size?: number;
  page_token?: string;
}

export enum AppManageAppSceneType {
  selfManaged = 0,
  fromStore = 1,
}

export enum AppManageAppStatus {
  disabled = 0,
  active = 1,
}

export interface AppManageAppEntry {
  app_id: string;
  primary_language: string;
  app_name: string;
  description: string;
  avatar_url: string;
  app_scene_type: AppManageAppSceneType;
  status: AppManageAppStatus;
}

export interface AppManageUserVisibleAppsData
  extends AppManagePageResponseData {
  lang: string;
  app_list: AppManageAppEntry[];
}

export interface AppManageInstalledAppListOptions {
  /**
   * -1 means no filtering
   */
  status: -1 | AppManageAppStatus;
  lang?: string;
  page_token?: string;
  page_size?: number;
}

export interface AppManageInstalledAppListData
  extends AppManagePageResponseData {
  lang: string;
  app_list: AppManageAppEntry[];
}

export interface AppManageUpdateAppVisibilityOptions {
  app_id: string;
  add_users?: Partial<AppManageAppVisibilityUserEntry>[];
  del_users?: Partial<AppManageAppVisibilityUserEntry>[];
  is_visible_to_all?: AppManageBoolean;
  add_departments?: string[];
  del_departments?: string[];
}

export interface AppManageAdminUserEntry {
  open_id: string;
  user_id: string;
  union_id: string;
}

export interface AppManageAdminUserListData {
  user_list: AppManageAdminUserEntry[];
}

export class AppManageAPI extends LarkAPI {
  async isUserAdmin(idType: 'open_id' | 'employee_id', id: string) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify({[idType]: id});

    return this.client.get<DataResponse<AppManageIsUserAdminData>>(
      `application/v3/is_user_admin?${query}`,
      tenant_access_token,
    );
  }

  async getUserAdminScope(idType: 'open_id' | 'employee_id', id: string) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify({[idType]: id});

    return this.client.get<DataResponse<AppManageUserAdminScopeData>>(
      `contact/v1/user/admin_scope/get?${query}`,
      tenant_access_token,
    );
  }

  async getAppVisibility(
    appId: string,
    userPageToken?: string,
    userPageSize?: number,
  ) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify({
      app_id: appId,
      user_page_token: userPageToken,
      user_page_size: userPageSize,
    });

    return this.client.get<DataResponse<AppManageAppVisibilityData>>(
      `application/v1/app/visibility?${query}`,
      tenant_access_token,
    );
  }

  async getUserVisibleApps(options: AppManageUserVisibleAppsOptions) {
    let {id_type, id, ...restOptions} = options;

    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify({
      [id_type]: id,
      ...restOptions,
    });

    return this.client.get<DataResponse<AppManageUserVisibleAppsData>>(
      `application/v1/user/visible_apps?${query}`,
      tenant_access_token,
    );
  }

  async getInstalledAppList(options: AppManageInstalledAppListOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify(options);

    return this.client.get<DataResponse<AppManageInstalledAppListData>>(
      `application/v3/app/list?${query}`,
      tenant_access_token,
    );
  }

  async updateAppVisibility(options: AppManageUpdateAppVisibilityOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    await this.client.post(
      'application/v3/app/update_visibility',
      options,
      tenant_access_token,
    );
  }

  async getAdminUserList() {
    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.get<DataResponse<AppManageAdminUserListData>>(
      'user/v4/app_admin_user/list',
      tenant_access_token,
    );
  }
}
