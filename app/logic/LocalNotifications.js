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
        if ( agenda.reminder ) {
            let fireDate = new Date(agenda.today + agenda.reminder);
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