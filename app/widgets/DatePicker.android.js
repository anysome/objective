/**
 * Created by Layman(http://github.com/anysome) on 16/3/6.
 */
import React from 'react'
import {DatePickerAndroid} from 'react-native'

export default class DatePicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    });
  }

  async _popup() {
    try {
      let {action, year, month, day} = await DatePickerAndroid.open({
        date: this.props.date
        // date: new Date(this.props.date.getTime() + 86400000) // fixed bug
      });
      if (action === DatePickerAndroid.dismissedAction) {
        // tick setting props.visible for android
        this.props.onDateChange(this.props.date);
      } else {
        this.props.onDateChange(new Date(year, month, day));
      }
    } catch (e) {
      console.warn('Cannot open date picker');
    }
  }

  render() {
    if (this.state.visible) {
      this._popup();
    }
    return null;
  }
}
