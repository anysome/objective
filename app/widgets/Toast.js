/**
 * Created by Layman(http://github.com/anysome) on 16/5/2.
 */

import {ToastAndroid} from 'react-native';
import Toast from 'react-native-root-toast';
import util from '../libs/Util';


function _showIOS(message, position =  -70) {
  Toast.show(message, {
    duration: Toast.durations.SHORT,
    position: position,//Toast.positions.BOTTOM,
    shadow: false,
    animation: true,
    hideOnPress: true,
    delay: 0,
    onShow: () => {
      // calls on toast\`s appear animation start
    },
    onShown: () => {
      // calls on toast\`s appear animation end.
    },
    onHide: () => {
      // calls on toast\`s hide animation start.
    },
    onHidden: () => {
      // calls on toast\`s hide animation end.
    }
  });
}

function _showAndroid(message, position =  -70) {
  ToastAndroid.show(message, ToastAndroid.SHORT)
}

export default util.isAndroid() ? _showAndroid : _showIOS;
