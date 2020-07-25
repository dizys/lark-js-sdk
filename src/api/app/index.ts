import {LarkAPI} from '../@api';
import {AppManageAPI} from './manage';
import {AppStoreAPI} from './store';

export class AppAPI extends LarkAPI {
  manage = new AppManageAPI(this.client);
  store = new AppStoreAPI(this.client);
}

export * from './manage';
export * from './store';
