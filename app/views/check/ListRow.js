/**
 * Created by Layman(http://github.com/anysome) on 16/3/10.
 */
import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, PixelRatio} from 'react-native';
import moment from 'moment';

import {colors, styles} from '../../app';
import objective from '../../logic/Objective';

export default class ListRow extends React.Component {

  constructor(props) {
    super(props);
    this.done = props.sectionId === 2;
    this.arranged = props.sectionId == 1;
  }

  _transform(checkDaily) {
    let dateEnd = moment(checkDaily.endDate);
    let unitName = objective.getUnitName(checkDaily.unit);
    let maybe = '', progress = '';
    let undoSize = 26, doneColor = colors.dark1;
    if (checkDaily.gross === 1) {
      if (checkDaily.closed) {
        progress = checkDaily.total + checkDaily.times;
        undoSize = 14;
        doneColor = colors.border;
      } else {
        progress = checkDaily.total;
      }
    } else {
      if (checkDaily.closed) {
        progress = checkDaily.progress + checkDaily.times;
        undoSize = 14;
        doneColor = colors.border;
      } else {
        progress = checkDaily.progress;
      }
    }
    if (checkDaily.frequency === '1') {
      maybe = '1 天 ' + checkDaily.gross + unitName;
    } else {
      let ms = checkDaily.endDate - this.props.today;
      let checkLeftDays = 1;
      if (ms > 0) {
        checkLeftDays = ms / 86400000 + 1;
      }
      let lefts = checkDaily.gross - checkDaily.progress;
      if (lefts < 1) {
        maybe = '偷着乐吧';
      } else if (checkLeftDays === 1) {
        maybe = '1 天 ' + lefts + unitName;
      } else {
        let rate = lefts / checkLeftDays;
        if (rate > 1) {
          maybe = '1 天 ' + rate.toFixed(1) + unitName;
        } else {
          rate = checkLeftDays / lefts;
          maybe = rate.toFixed(1) + ' 天 1 ' + unitName;
        }
      }
    }
    let frequencyName = objective.getFrequencyName(checkDaily.frequency);
    return {
      priorityColor: objective.getPriorityColor(checkDaily.priority),
      title: checkDaily.title,
      detail: checkDaily.detail,
      timeLeft: dateEnd.add(1, 'days').fromNow(),
      progress: progress,
      maybe: maybe,
      undoSize: undoSize,
      doneColor: doneColor,
      arrangedColor: checkDaily.arranged ? colors.border : colors.dark2,
      summary: `${frequencyName} ${checkDaily.gross} ${unitName}`
    };
  }

  render() {
    var transform = this._transform(this.props.data);
    return (
      <TouchableOpacity style={[style.container, {borderLeftColor: transform.priorityColor}]}
                        onPress={this.props.onPress}
                        onLongPress={this.props.onLongPress}>
        <Text style={style.title}>「+{transform.progress}」{transform.title}</Text>
        <Text style={style.text}>
          {transform.summary},  预计 <Text style={{color: transform.arrangedColor,fontSize: transform.undoSize}}>{transform.maybe}</Text>
        </Text>
        <View style={style.containerF}>
          <Text style={style.hint}>{transform.detail}</Text>
          <Text style={[styles.text, {color: transform.doneColor}]}>{transform.timeLeft}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: 20,
    paddingRight: 16,
    paddingLeft: 10,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: colors.light1,
    borderLeftWidth: 6,
    borderLeftColor: colors.border,
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: colors.light3,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: colors.light3
  },
  title: {
    flex: 1,
    color: colors.dark3,
    fontSize: 20,
    marginLeft: -10
  },
  text: {
    paddingTop: 3,
    paddingBottom: 4,
    color: colors.border,
    fontSize: 14
  },
  containerF: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  hint: {
    flex: 1,
    fontSize: 12,
    paddingRight: 8,
    color: colors.border
  }
});
