/**
 * Created by Layman(http://github.com/anysome) on 16/3/21.
 */

import Notification from 'react-native-system-notification';

function hash(str) {
  let hash = 0, i, chr, len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function noop() {
  // do nothing for promise chain
}

Notification.addListener('press', function(e) {
  // console.log(JSON.stringify(e));
  // stop repeating when user click notification
  let payload = e.payload;
  if ( payload ) {
    let nid = hash(payload.type + ": " + payload.id);
    // cancel
    Notification.find(nid).then(function(notification) {
      Notification.delete(nid).then(noop, noop);
    }, noop);
  } else {
    Notification.clearAll().then(noop, noop);
  }
});

export default class LocalNotifications {

  static scheduleAgenda(agenda) {
    let nid = hash('agenda: ' + agenda.id);
    console.log('notification id = ' + nid);
    // cancel old
    Notification.find(nid).then(function(notification) {
      Notification.delete(nid).then(noop, noop);
    }, noop);
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
        id: nid,
        subject: agenda.title,
        message: agenda.detail || '行事易提醒您该干活了哦~',
        payload: {type:'agenda', id: agenda.id},
        sendAt: fireDate,
        repeatEvery: 'minute',
        repeatCount: 3
      });
    }
  }

  static cancelAgenda(id) {
    let nid = hash('agenda: ' + id);
    console.log('notification id = ' + nid);
    Notification.find(nid).then(function(notification) {
      Notification.delete(nid).then(noop, noop);
    }, noop);
  }
};
