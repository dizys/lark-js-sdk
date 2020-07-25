import {LarkAPI} from '../@api';
import {BotGroupAPI} from './group';
import {BotManageAPI} from './manage';

export class BotAPI extends LarkAPI {
  group = new BotGroupAPI(this.client);
  manage = new BotManageAPI(this.client);
}

export * from './group';
export * from './manage';
