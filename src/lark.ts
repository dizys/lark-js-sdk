import {LarkAPIClient} from './client';
import {AuthenAPI, ContactAPI, UserGroupAPI, AppAPI, BotAPI} from './api';

export class Lark {
  client = new LarkAPIClient(this.appId, this.appSecret, this.internal);
  authen = new AuthenAPI(this.client);
  contact = new ContactAPI(this.client);
  userGroup = new UserGroupAPI(this.client);
  app = new AppAPI(this.client);
  bot = new BotAPI(this.client);

  constructor(
    private appId: string,
    private appSecret: string,
    private internal = true,
  ) {}
}
