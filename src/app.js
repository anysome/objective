/**
 * Created by  Layman(https://github.com/anysome) on 2016/11/9.
 */
import I18n from 'react-native-i18n';
import moment from 'moment';
// import MobclickAgent from 'rn-umeng';

import config from './config.json';
import api from './api.json';
import airloy, {configure, use} from 'airloy/src';
import airloyReactNative from 'airloy-react-native';
import {colors, styles} from './views/styles';

configure(config.airloy);
use(airloyReactNative);

import toast from './widgets/Toast';
import ActivityIndicator from './widgets/ActivityIndicator';

// // analytics
// MobclickAgent.startWithAppkey(config.keys.umeng);
// MobclickAgent.setDebugMode(true);
// MobclickAgent.getDeviceInfo(info => {
//   console.log(JSON.stringify(info));
// });

console.log('locale = ' + I18n.locale);
I18n.fallbacks = true;
I18n.missingTranslationPrefix = '';
I18n.missingBehaviour = 'guess';
// I18n.defaultLocale = I18n.locale;
I18n.translations = require('./langs');
// require('moment/locale/' + I18n.locale);
// moment.locale(I18n.locale);
require('moment/locale/zh-cn');
moment.locale('zh-cn');


function L(message, options) {
  return I18n.translate(message, options);
}

function hang(upOrType = true) {
  if(upOrType) {
    ActivityIndicator.show(typeof(upOrType) === 'string' ? upOrType : 'Wave');
  } else {
    ActivityIndicator.hide();
  }
}


let MobclickAgent = {
  onEvent: function () {
    console.log('analytics on event');
  },
  onProfileSignIn: function () {
    console.log('analytics on profileSignIn');
  },
  onProfileSignOff: function () {
    console.log('analytics on profileSignOff');
  },
  onPageStart: function () {
    console.log('analytics on pageStart');
  },
  onPageEnd: function () {
    console.log('analytics on pageStart');
  }
};
export { MobclickAgent as analytics, config, styles, colors, airloy, api, L, toast, hang};
