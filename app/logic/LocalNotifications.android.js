/**
 * Created by Layman(http://github.com/anysome) on 16/3/21.
 */

import Notification from 'react-native-system-notification';

function hash(str) {
  let hash = 0, i, chr, len;
  if (str.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export default class LocalNotifications {

  static scheduleAgenda(agenda) {
    // cancel old
    Notification.delete(hash('agenda: ' + agenda.id));
    // schedule new if necessary
    if (agenda.reminder) {
      let now = new Date();
      let tzOffset = (now).getTimezoneOffset() * 60000;
      // fix bug for timezone offset
      let alarmTime = agenda.today + agenda.reminder - tzOffset;
      // check future time
      if ( alarmTime < now ) {
        return;
      }
      let fireDate = new Date(alarmTime);
      fireDate.setSeconds(1);
      Notification.create({
        subject: agenda.title,
        message: agenda.detail || '行事易提醒您该干活了哦~',
        sendAt: fireDate,
        repeatEvery: 'minute',
        count: 1
      });
    }
  }

  static cancelAgenda(id) {
    Notification.delete(hash('agenda: ' + agenda.id));
  }
};
