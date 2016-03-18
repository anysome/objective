/**
 * Created by Layman(http://github.com/anysome) on 16/3/6.
 */
'use strict';

import React, {Component, DatePickerAndroid} from 'react-native';

export default class DatePicker extends Component {

    async _popup() {
        try {
            let {action, year, month, day} = await DatePickerAndroid.open({
                // 要设置默认值为今天的话，使用`new Date()`即可。
                // 下面显示的会是2020年5月25日。月份是从0开始算的。
                date: this.props.date
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day
                this.props.onDateChange(new Date(year, month, day));
            }
        } catch (e) {
            console.warn('Cannot open date picker');
        }
    }

    render() {
        if ( this.props.visible ) {
            this._popup();
        }
        return null;
    }
}