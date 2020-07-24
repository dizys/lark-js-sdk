import {LarkAPI} from '../@api';
import {ContactUserAPI} from './user';
import {DataResponse} from '../../client';

export interface ScopeData {
  authed_departments: string[];
  authed_open_departments: string[];
  authed_employee_ids: string[];
  authed_open_ids: string[];
}

export class ContactAPI extends LarkAPI {
  user = new ContactUserAPI(this.client);

  async getScopes() {
    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.get<DataResponse<ScopeData>>(
      'contact/v1/scope/get',
      tenant_access_token,
    );
  }
}
