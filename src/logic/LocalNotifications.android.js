/**
 * Created by Layman(http://github.com/anysome) on 16/3/21.
 */

// import Notification from 'react-native-system-notification';
import PushNotification from 'react-native-push-notification';

PushNotification.configure({

  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
    console.log( 'TOKEN:', token );
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log( 'NOTIFICATION:', notification );
  },

  // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
  senderID: "YOUR GCM SENDER ID",

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   */
  requestPermissions: true,
});

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

// Notification.addListener('press', function(e) {
//   // console.log(JSON.stringify(e));
//   // stop repeating when user click notification
//   let payload = e.payload;
//   if ( payload ) {
//     let nid = hash(payload.type + ": " + payload.id);
//     // cancel
//     Notification.find(nid).then(function(notification) {
//       Notification.delete(nid).then(noop, noop);
//     }, noop);
//   } else {
//     Notification.clearAll().then(noop, noop);
//   }
// });

export default class LocalNotifications {

  static scheduleAgenda(agenda) {
    let nid = hash('agenda: ' + agenda.id);
    console.log('notification id = ' + nid);
    // cancel old
    PushNotification.cancelLocalNotifications({id: nid});
    // schedule new if necessary
    if (agenda.reminder) {
      let now = new Date();
      // let tzOffset = (now).getTimezoneOffset() * 60000;
      // fix bug for timezone offset
      let alarmTime = agenda.today + agenda.reminder;
      // check future time
      if ( alarmTime < now ) {
        return;
      }
      let fireDate = new Date(alarmTime);
      fireDate.setSeconds(1);
      PushNotification.localNotificationSchedule({
        id: nid,
        message: agenda.title, // (required)
        subText: agenda.detail || '行事易提醒您该干活了哦~',
        // data: {type:'agenda', id: agenda.id}, // ?????
        date: fireDate
      });
    }
  }

  static cancelAgenda(id) {
    let nid = hash('agenda: ' + id);
    console.log('notification id = ' + nid);
    PushNotification.cancelLocalNotifications({id: nid});
  }
};
