/**
 * Created by Layman(http://github.com/anysome) on 16/5/19.
 */
import React from 'react'
import {StyleSheet, View} from 'react-native'
import WheelView from 'react-native-wheel'

export default class TimePicker extends React.Component {

  render() {
    return (
      <DateTimePicker
        date={this.props.date}
        mode="time"
        minuteInterval={this.props.minuteInterval || 5}
        onDateChange={this.props.onDateChange}
      />
    )
  }
}


function makeRange (min, max, step, twice) {
  const range = [];
  var entry = "";

  min = min || 0;
  max = max || 9999;
  step = step || 1;

  for(min; min <= max; min += step) {
    entry = min + "";
    if (twice) {
      entry = entry.length === 1 ? "0" + entry : entry;
    }
    range.push(entry);
  }

  return range;
}


class DateTimePicker extends React.Component {
  constructor(props) {
    super(props);
    const { minuteInterval, date } = props;
    let dateIndices = this.getDateIndices(date);
    this.minutes = makeRange(0, 59, minuteInterval, true);
    this.hours = makeRange(1, 12);
    this.ampm = ['AM', 'PM'];
    this.state = dateIndices;
  }

  getDateIndices(date) {
    const { minuteInterval } = this.props;
    let hour = date.getHours();
    let hourIndex = hour % 12;
    const ampmIndex = hour > 11 ? 1 : 0;
    hourIndex = hourIndex === 0 ? 11 : hourIndex - 1;
    const minuteIndex = Math.floor(date.getMinutes() / minuteInterval);
    return {
      hourIndex,
      minuteIndex,
      ampmIndex
    };
  }

  getNewDate(hourIndex, minuteIndex, ampmIndex) {

    hourIndex = hourIndex + 1;
    hourIndex = hourIndex === 12 ? 0 : hourIndex;
    hourIndex = ampmIndex === 0 ? hourIndex : hourIndex + 12;

    let minutes = minuteIndex * this.props.minuteInterval;
    let newDate = new Date();
    newDate.setHours(hourIndex, minutes, 0, 0);
    return newDate;
  }

  onHourChange(index) {
    this.setState({
      hourIndex: index
    });
    let newDate = this.getNewDate(index, this.state.minuteIndex, this.state.ampmIndex);
    this.props.onDateChange(newDate);
  }

  onMinuteChange(index) {
    this.setState({
      minuteIndex: index
    });
    let newDate = this.getNewDate(this.state.hourIndex, index, this.state.ampmIndex);
    this.props.onDateChange(newDate);
  }

  onAmpmChange(index) {
    this.setState({
      ampmIndex: index
    });
    let newDate = this.getNewDate(this.state.hourIndex, this.state.minuteIndex, index);
    this.props.onDateChange(newDate);
  }

  render() {
    return (
      <View style={style.container} >
        <WheelView
          style={style.wheel}
          onItemChange={this.onHourChange.bind(this)}
          values={this.hours}
          isLoop={true}
          selectedIndex={this.state.hourIndex}
          textSize={this.props.textSize}
        />
        <WheelView
          style={style.wheel}
          onItemChange={(index) => this.onMinuteChange(index)}
          values={this.minutes}
          isLoop={true}
          selectedIndex={this.state.minuteIndex}
          textSize={this.props.textSize}
        />
        <WheelView
          style={style.wheel}
          onItemChange={(index) => this.onAmpmChange(index)}
          values={this.ampm}
          isLoop={false}
          selectedIndex={this.state.ampmIndex}
          textSize={this.props.textSize}
        />
      </View>
    );
  }
}

DateTimePicker.defaultProps = {
  date: new Date(),
  minuteInterval: 1,
  textSize: 20
};

DateTimePicker.propTypes = {
  date: React.PropTypes.instanceOf(Date),
  minuteInterval: React.PropTypes.oneOf([1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30]),
  onDateChange: React.PropTypes.func.isRequired,
  textSize: React.PropTypes.number,
};

const style = StyleSheet.create({
  wheel: {
    flex: 1,
    height: 200
  },
  container: {
    flex: 1,
    paddingLeft: 50,
    paddingRight: 50,
    height: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
