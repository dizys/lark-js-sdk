import {LarkAPIClient} from './client';
import {AuthenAPI, ContactAPI, UserGroupAPI} from './api';

export class Lark {
  client = new LarkAPIClient(this.appId, this.appSecret, this.internal);
  authen = new AuthenAPI(this.client);
  contact = new ContactAPI(this.client);
  userGroup = new UserGroupAPI(this.client);

  constructor(
    private appId: string,
    private appSecret: string,
    private internal = true,
  ) {}
}
