import {LarkAPIClient} from '../client';

export interface PageResponseData {
  has_more: boolean;
  page_token: string;
}

export abstract class LarkAPI {
  constructor(protected client: LarkAPIClient) {}
}
