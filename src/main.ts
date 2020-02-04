import { Wechaty } from 'wechaty';
import { ContactSelf } from 'wechaty/dist/src/user';
import { PuppetMacpro } from 'wechaty-puppet-macpro';
import { generate } from 'qrcode-terminal';
import { scheduleJob } from 'node-schedule';
import { checkRoom, sendBible } from './bible';

const bot = new Wechaty({
  puppet: new PuppetMacpro(),
  name: 'sotv',
});

bot
  .on('scan', (qrcode) => {
    const qrcodeImageUrl = [
      'https://api.qrserver.com/v1/create-qr-code/?data=',
      encodeURIComponent(qrcode),
    ].join('');

    console.log(`${qrcodeImageUrl} [${qrcode}]`);

    generate(qrcode, { small: true });
  })
  .on('logout', (user) => {
    console.log(`${user.name()} logouted`);
  })
  .on('error', (e) => {
    console.error('Bot error:', e);
  })
  .on('login', onLogin)
  .start();

async function onLogin(user: ContactSelf) {
  console.log(`login user : ${user.name()}`);

  await checkRoom(bot);

  scheduleJob('0 7 * * 1-6', sendBible);
}
