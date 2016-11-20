/**
 * Created by Layman(http://github.com/anysome) on 16/3/21.
 */

import Notification from 'react-native-system-notification';
import moment from 'moment';

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
  console.log('press notification. %o', e);
  // stop repeating when user click notification
  let payload = e.payload;
  if ( payload ) {
    // cancel
    Notification.find(payload.id).then(function(notification) {
      Notification.delete(payload.id).then(noop, noop);
    });
  } else {
    Notification.clearAll().then(noop, noop);
  }
});

export default class LocalNotifications {

  static scheduleAgenda(agenda) {
    // cancel old
    LocalNotifications.cancelAgenda(agenda.id);
    // schedule new if necessary
    if (agenda.reminder) {
      let now = new Date();
      let alarmTime = moment(moment(agenda.today).format('YYYY-MM-DD ') + agenda.reminder).toDate().getTime();
      // check future time
      if ( alarmTime < now ) {
        return;
      }
      let fireDate = new Date(alarmTime);
      fireDate.setSeconds(0);
      Notification.create({
        id: agenda.id,
        subject: agenda.title,
        message: agenda.detail || '行事易提醒您该干活了哦~',
        payload: {type:'agenda', id: agenda.id},
        sendAt: fireDate,
        repeatEvery: 'minute',
        repeatCount: 2
      }).then(()=>console.log('created notification will fire at ' + fireDate), (e)=> console.log('can not create notification. %o', e));
      console.log('do schedule id = ' + agenda.title);
    }
  }

  static cancelAgenda(id) {
    Notification.find(id).then(function(notification) {
      Notification.delete(id).then(noop, noop);
    }, noop);
  }
};
