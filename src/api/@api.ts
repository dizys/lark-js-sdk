import {LarkAPIClient} from '../client';

export abstract class LarkAPI {
  constructor(protected client: LarkAPIClient) {}
}
