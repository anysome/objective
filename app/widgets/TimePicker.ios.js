/**
 * Created by Layman(http://github.com/anysome) on 16/5/19.
 */
import React from 'react'
import {DatePickerIOS} from 'react-native'

export default class TimePicker extends React.Component {
  
  render() {
    return (
      <DatePickerIOS
        date={this.props.date}
        mode="time"
        minuteInterval={this.props.minuteInterval || 5}
        onDateChange={this.props.onDateChange}
      />
    )
  }
}
