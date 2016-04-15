/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
'use strict';

import I18n from 'react-native-i18n';
import Toast from 'react-native-root-toast';
import moment from 'moment';
require('moment/locale/zh-cn');

import config from '../config.json';
import api from './api.json';
import airloy, {init} from './libs/airloy';
import MyAuth from './libs/dev/DevAuth';

import {colors, styles} from './views/styles';

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

function toast(message, position =  -70) {
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


export default {
    config: config,
    airloy: airloy,
    colors: colors,
    styles: styles,
    L: L,
    toast: toast
};

export { config, styles, colors, airloy, api, L, toast};