/**
 * Created by Layman(http://github.com/anysome) on 16/3/6.
 */
import React from 'react'
import {DatePickerIOS} from 'react-native'


export default class DatePicker extends React.Component {

  constructor(props) {
    let {visible, ...others} = props;
    super(others);
  }

  render() {
    let picker = null;
    if (this.props.visible) {
      picker = <DatePickerIOS
        date={this.props.date}
        mode="date"
        onDateChange={this.props.onDateChange}
      />;
    }
    return picker;
  }
}
