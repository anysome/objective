/**
 * Created by Layman(http://github.com/anysome) on 16/5/16.
 */
import {ToastAndroid} from 'react-native';

export default function (message, position =  -70) {
  ToastAndroid.show(message, ToastAndroid.SHORT)
}
