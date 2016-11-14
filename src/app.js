/**
 * Created by  Layman(https://github.com/anysome) on 2016/11/9.
 */
import I18n from 'react-native-i18n';
import moment from 'moment';
import MobclickAgent from 'rn-umeng';

import config from './config.json';
import api from './api.json';
import airloy, {configure, use} from 'airloy/src';
import airloyReactNative from 'airloy-react-native';
import {colors, styles, px1} from './views/styles';

configure(config.airloy);
use(airloyReactNative);

import toast from './widgets/Toast';
import ActivityIndicator from './widgets/ActivityIndicator';

// analytics
MobclickAgent.startWithAppkey(config.keys.umeng);
MobclickAgent.setDebugMode(true);
MobclickAgent.getDeviceInfo(info => {
  console.log(JSON.stringify(info));
});

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

export { MobclickAgent as analytics, config, styles, colors, px1, airloy, api, L, toast, hang};
