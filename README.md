# lark-js-sdk

Third-party JavaScript Lark (Feishu, 飞书) SDK written in TypeScript

## Installation

```bash
npm install --save lark-js-sdk
```

## Quick Start

Send message to groups that the bot is in:

```js
import {Lark} from 'lark-js-sdk';

async function sendMessage() {
  let lark = new Lark('<YOUR_APP_ID>', '<YOUR_APP_SECRET>');

  let {groups} = await lark.bot.group.getList();

  let chatIds = groups.map(group => group.chat_id);

  for (let chatId of chatIds) {
    let {message_id} = await lark.message.send({
      chat_id: chatId,
      msg_type: 'text',
      content: {text: 'Hello, Lark!'},
    });

    console.log(`Message (${message_id}) sent!`);
  }
}

sendMessage();
```

Add user

```js
import {Lark} from 'lark-js-sdk';

let lark = new Lark('<YOUR_APP_ID>', '<YOUR_APP_SECRET>');

lark.contact.user
  .add({
    name: 'Dizy',
    mobile: '18900000000',
    department_ids: ['od-234355343342acdbef33'],
    need_send_notification: true,
  })
  .then(data => {
    let {user_info} = data;

    console.log('User added:', user_info);
  });
```
