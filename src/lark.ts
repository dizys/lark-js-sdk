import {LarkAPIClient} from './client';
import {
  AuthenAPI,
  ContactAPI,
  UserGroupAPI,
  AppAPI,
  BotAPI,
  MessageAPI,
  NotifyAPI,
} from './api';

export class Lark {
  client = new LarkAPIClient(this.appId, this.appSecret, this.internal);
  authen = new AuthenAPI(this.client);
  contact = new ContactAPI(this.client);
  userGroup = new UserGroupAPI(this.client);
  app = new AppAPI(this.client);
  bot = new BotAPI(this.client);
  message = new MessageAPI(this.client);
  notify = new NotifyAPI(this.client);

  constructor(
    private appId: string,
    private appSecret: string,
    private internal = true,
  ) {}
}
