/**
 * Created by Layman(http://github.com/anysome) on 16/3/21.
 */

import {PushNotificationIOS} from 'react-native';

export default class LocalNotifications {

  static scheduleAgenda(agenda) {
    PushNotificationIOS.requestPermissions();
    // cancel old
    PushNotificationIOS.cancelLocalNotifications({agenda: agenda.id});
    // schedule new if necessary
    if (agenda.reminder) {
      // check future time
      let now = new Date();
      let alarmTime = agenda.today + agenda.reminder;
      if ( alarmTime < now) {
        return;
      }
      // fix bug for timezone offset
      let tzOffset = (now).getTimezoneOffset() * 60000;
      let fireDate = new Date(alarmTime - tzOffset);
      fireDate.setSeconds(1);
      PushNotificationIOS.scheduleLocalNotification({
        fireDate: fireDate.toISOString(),
        alertBody: agenda.title,
        soundName: 'default',
        userInfo: {agenda: agenda.id}
      });
    }
  }

  static cancelAgenda(id) {
    PushNotificationIOS.cancelLocalNotifications({agenda: id});
  }
};
