import FormData from 'isomorphic-form-data';
import QS from 'query-string';

import {LarkAPI} from './@api';
import {DataResponse, DownloadResponseType} from '../client';

export interface MessageSendTextOptionsBase {
  msg_type: 'text';
  content: {
    text: string;
  };
}

export interface MessageSendImageOptionsBase {
  msg_type: 'image';
  content: {
    image_key: string;
  };
}

export interface PostTextElement {
  tag: 'text';
  text: string;
  un_escape?: boolean;
  lines?: number;
}

export interface PostAElement {
  tag: 'a';
  text: string;
  un_escape?: boolean;
  href: string;
}

export interface PostAtElement {
  tag: 'at';
  user_id: string;
}

export interface PostImgElement {
  tag: 'img';
  image_key: string;
  height: number;
  width: number;
}

export type PostElement =
  | PostTextElement
  | PostAElement
  | PostAtElement
  | PostImgElement;

export type PostI18nType = 'zh_cn' | 'en_us' | 'ja_jp' 

export interface MessageSendPostOptionsBase {
  msg_type: 'post';
  content: {
    post: {
      [key in PostI18nType]?: {
        title: string;
        content: PostElement[][];
      };
    }
  };
}

export interface MessageSendShareChatOptionsBase {
  msg_type: 'share_chat';
  content: {
    share_chat_id: string;
  };
}

export interface CardText {
  tag: 'plain_text' | 'lark_md';
  content?: string;
  i18n?: {[key: string]: string};
  lines?: number;
}

export interface CardField {
  is_short: boolean;
  text: CardText;
}

export interface CardURL {
  url: string;
  android_url: string;
  ios_url: string;
  pc_url: string;
}

export interface CardConfirm {
  title: CardText;
  text: CardText;
}

export interface CardOption {
  text?: CardText;
  value: string;
  url?: string;
  multi_url?: CardURL;
}

export interface CardImageElement {
  tag: 'img';
  img_key: string;
  alt: CardText;
}

export interface CardButtonElement {
  tag: 'button';
  text: CardText;
  url?: string;
  multi_url?: CardURL;
  type?: 'default' | 'primary' | 'danger';
  value?: object;
  confirm?: CardConfirm;
}

export interface CardSelectMenuElement {
  tag: 'select_static' | 'select_person';
  placeholder?: CardText;
  initial_option?: string;
  options?: CardOption[];
  value?: object;
  confirm?: CardConfirm;
}

export interface CardOverflowElement {
  tag: 'overflow';
  options: CardOption[];
  value?: object;
  confirm?: CardConfirm;
}

export interface CardDatePickerElement {
  tag: 'date_picker' | 'picker_time' | 'picker_datetime';
  initial_date?: string;
  initial_time?: string;
  initial_datetime?: string;
  placeholder?: string;
  value?: object;
  confirm?: CardConfirm;
}

export interface CardContentTextOnlyModule {
  tag: 'div';
  text: CardText;
  extra?: CardElement;
}

export interface CardContentFieldsOnlyModule {
  tag: 'div';
  fields: CardField[];
  extra?: CardElement;
}

export type CardContentModule =
  | CardContentTextOnlyModule
  | CardContentFieldsOnlyModule;

export interface CardDividingLineModule {
  tag: 'hr';
}

export interface CardImageModule {
  tag: 'img';
  img_key: string;
  alt: CardText;
  title?: CardText;
  mode?: 'fit_horizontal' | 'crop_center';
}

export type CardInteractiveElement =
  | CardButtonElement
  | CardSelectMenuElement
  | CardOverflowElement
  | CardDatePickerElement;

export type CardElement = CardImageElement | CardInteractiveElement;

export interface CardActionModule {
  tag: 'action';
  actions: CardInteractiveElement[];
  layout?: 'bisected' | 'trisection' | 'flow';
}

export interface CardNoteModule {
  tag: 'note';
  elements: (CardText | CardImageElement)[];
}

export type CardModule =
  | CardContentModule
  | CardDividingLineModule
  | CardImageModule
  | CardActionModule
  | CardNoteModule;

export interface Card {
  config?: {
    wide_screen_mode: boolean;
  };
  header?: {
    title: CardText;
  };
  elements?: CardModule[];
  i18n_elements?: {[key: string]: CardModule[]};
}

export interface SendCardOptions {
  chat_id?: string;
  open_id?: string;
  email?: string;
  user_id?: string;
  msg_type: 'interactive';
  card: Card;
  root_id?: string;
  update_multi?: boolean;
}

export interface MessageSendCardOptionsBase {
  msg_type: 'interactive';
  card: Card;
  update_multi?: boolean;
}

export type MessageSendTypeOptionsBase =
  | MessageSendTextOptionsBase
  | MessageSendImageOptionsBase
  | MessageSendPostOptionsBase
  | MessageSendShareChatOptionsBase
  | MessageSendCardOptionsBase;

export type MessageSendOptions = MessageSendTypeOptionsBase & {
  open_id?: string;
  user_id?: string;
  email?: string;
  chat_id?: string;
  root_id?: string;
};

export interface MessageSendData {
  message_id: string;
}

export type MessageSendInBatchOptions = MessageSendTypeOptionsBase & {
  department_ids?: string[];
  open_ids?: string[];
  user_ids?: string[];
};

export interface MessageSendInBatchData {
  message_id: string;
  invalid_department_ids: string[];
  invalid_open_ids: string[];
  invalid_user_ids: string[];
}

export interface MessageReadUserEntry {
  open_id: string;
  user_id?: string;
  timestamp: string;
}

export interface MessageReadInfoData {
  read_users: MessageReadUserEntry[];
}

export interface MessageUploadImageData {
  image_key: string;
}

export class MessageAPI extends LarkAPI {
  async send(options: MessageSendOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.post<DataResponse<MessageSendData>>(
      'message/v4/send/',
      options,
      tenant_access_token,
    );
  }

  async sendInBatch(options: MessageSendInBatchOptions) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    return this.client.post<DataResponse<MessageSendInBatchData>>(
      'message/v4/batch_send/',
      options,
      tenant_access_token,
    );
  }

  async getReadInfo(messageId: string) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let data = {message_id: messageId};

    return this.client.post<DataResponse<MessageReadInfoData>>(
      'message/v4/read_info/',
      data,
      tenant_access_token,
    );
  }

  async uploadImage(imageType: 'message' | 'avatar', image: any) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let formData = new FormData();

    formData.append('image_type', imageType);
    formData.append('image', image);

    return this.client.postFormData<DataResponse<MessageUploadImageData>>(
      'image/v4/put/',
      formData,
      tenant_access_token,
    );
  }

  async downloadImage(imageKey: string, responseType: DownloadResponseType) {
    let tenant_access_token = await this.client.getTenantAccessToken();

    let query = QS.stringify({image_key: imageKey});

    return this.client.download(
      `image/v4/get?${query}`,
      responseType,
      tenant_access_token,
    );
  }
}
