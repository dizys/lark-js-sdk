import QS from 'query-string';
import {LarkAPI, PageResponseData} from '../@api';
import {DataResponse} from '../../client';

export interface AppStoreIsUserInPaidScopeData {
  status: 'valid' | 'not_in_scope' | 'no_active_license';
  price_plan_id: string;
  is_trial: boolean;
  service_stop_time: number;
}

export type AppStoreOrderStatus = 'normal' | 'refunded';

export interface AppStoreOrderListOptions {
  status?: AppStoreOrderStatus | 'all';
  page_size: number;
  page_token?: string;
  tenant_key?: string;
}

export type AppStorePlanType =
  | 'trial'
  | 'permanent'
  | 'per_year'
  | 'per_month'
  | 'per_seat_per_year'
  | 'per_seat_per_month'
  | 'permanent_count';

export type AppStoreOrderBuyType = 'buy' | 'upgrade' | 'renew';

export interface AppStoreOrderEntry {
  order_id: string;
  price_plan_id: string;
  price_plan_type: AppStorePlanType;
  seats?: number;
  buy_count: number;
  create_time: number;
  pay_time: number;
  status: AppStoreOrderStatus;
  buy_type: AppStoreOrderBuyType;
  src_order_id?: string;
  dst_order_id?: string;
  order_pay_price: number;
  tenant_key: string;
}

export interface AppStoreOrderListData extends PageResponseData {
  total: number;
  order_list: AppStoreOrderEntry[];
}

export interface AppStoreOrderInfoData {
  order: AppStoreOrderEntry;
}

export class AppStoreAPI extends LarkAPI {
  async isUserInPaidScope(idType: 'open_id' | 'user_id', id: string) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify({[idType]: id});

    return this.client.get<DataResponse<AppStoreIsUserInPaidScopeData>>(
      `pay/v1/paid_scope/check_user?${query}`,
      tenant_access_token,
    );
  }

  async getOrderList(options: AppStoreOrderListOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify(options);

    return this.client.get<DataResponse<AppStoreOrderListData>>(
      `pay/v1/order/list?${query}`,
      tenant_access_token,
    );
  }

  async getOrderInfo(orderId: string) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify({order_id: orderId});

    return this.client.get<DataResponse<AppStoreOrderInfoData>>(
      `pay/v1/order/get?${query}`,
      tenant_access_token,
    );
  }
}
