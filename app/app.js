/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
'use strict';

import I18n from 'react-native-i18n';
import moment from 'moment';
require('moment/locale/zh-cn');
import MobclickAgent from 'rn-umeng';

import config from '../config.json';
import api from './api.json';
import airloy, {init} from './libs/airloy';
import MyAuth from './libs/dev/DevAuth';
import {colors, styles} from './views/styles';

import toast from './widgets/Toast';
import ActivityIndicator from './widgets/ActivityIndicator';

// analytics
MobclickAgent.startWithAppkey(config.keys.umeng);
MobclickAgent.setDebugMode(true);
MobclickAgent.getDeviceInfo(info => {
  console.log(JSON.stringify(info));
});

// init
I18n.fallbacks = true;
I18n.missingTranslationPrefix = '';
I18n.missingBehaviour = 'guess';
I18n.defaultLocale = 'en';//'zh-CN';
I18n.translations = require('./langs');

moment.locale('zh-cn');

init(MyAuth, config.airloy);

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

export { MobclickAgent as analytics, config, styles, colors, airloy, api, L, toast, hang};
