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
