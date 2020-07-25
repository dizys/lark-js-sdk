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

export const DEFAULT_LARK_API_ENDPOINT =
  'https://open.larksuite.com/open-apis/';
export const DEFAULT_FEISHU_API_ENDPOINT = 'https://open.feishu.cn/open-apis/';

export class Lark {
  client = new LarkAPIClient(
    this.appId,
    this.appSecret,
    this.apiEndpoint,
    this.internal,
  );
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
    private apiEndpoint: string = DEFAULT_LARK_API_ENDPOINT,
    private internal = true,
  ) {}
}

export class Feishu extends Lark {
  constructor(
    appId: string,
    appSecret: string,
    apiEndpoint: string = DEFAULT_FEISHU_API_ENDPOINT,
    internal = true,
  ) {
    super(appId, appSecret, apiEndpoint, internal);
  }
}
