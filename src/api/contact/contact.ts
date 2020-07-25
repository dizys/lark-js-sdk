import {LarkAPI} from '../@api';
import {DataResponse} from '../../client';
import {ContactUserAPI} from './user';
import {ContactDepartmentAPI} from './department';
import {ContactBatchAPI} from './batch';

export interface ScopeData {
  authed_departments: string[];
  authed_open_departments: string[];
  authed_employee_ids: string[];
  authed_open_ids: string[];
}

export interface ContactCustomAttrsData<CustomAttrs = any> {
  is_open: boolean;
  custom_attrs: CustomAttrs;
}

export class ContactAPI extends LarkAPI {
  user = new ContactUserAPI(this.client);
  department = new ContactDepartmentAPI(this.client);
  batch = new ContactBatchAPI(this.client);

  async getScopes() {
    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.get<DataResponse<ScopeData>>(
      'contact/v1/scope/get',
      tenant_access_token,
    );
  }

  async getCustomAttrs() {
    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.get<DataResponse<ContactCustomAttrsData>>(
      'contact/v1/tenant/custom_attr/get',
      tenant_access_token,
    );
  }
}
