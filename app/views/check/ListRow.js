/**
 * Created by Layman(http://github.com/anysome) on 16/3/10.
 */
import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
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
    var maybe = '', progress = '';
    var closedColor = colors.dark1;
    if (checkDaily.gross === 1) {
      if (checkDaily.closed) {
        progress = checkDaily.total + checkDaily.times;
        closedColor = colors.border;
      } else {
        progress = checkDaily.total;
      }
    } else {
      if (checkDaily.closed) {
        progress = checkDaily.progress + checkDaily.times;
        closedColor = colors.border;
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
    let arrangedColor = checkDaily.arranged ? colors.border : colors.dark2;
    return {
      priorityColor: objective.getPriorityColor(checkDaily.priority),
      title: checkDaily.title,
      detail: checkDaily.detail,
      timeLeft: {text: dateEnd.add(1, 'days').fromNow(), color: arrangedColor},
      progress: progress,
      maybe: {text: maybe, color: closedColor},
      target: {text: checkDaily.gross + ' ' + unitName, color: arrangedColor},
      frequencyName: objective.getFrequencyName(checkDaily.frequency)
    };
  }

  render() {
    var transform = this._transform(this.props.data);
    return (
      <TouchableOpacity style={[style.container, {borderLeftColor: transform.priorityColor}]}
                        onPress={this.props.onPress}>
        <View style={style.containerF}>
          <Text style={styles.title}>{transform.title}</Text>
          <Text style={[styles.text, {color: transform.timeLeft.color}]}>{transform.timeLeft.text}</Text>
        </View>
        <View style={styles.containerH}>
          <View style={style.containerV}>
            <Text style={styles.text}>{transform.progress}</Text>
            <Text style={style.hint}>已完成</Text>
          </View>
          <View style={style.containerVC}>
            <Text style={[styles.text, {color: transform.maybe.color}]}>{transform.maybe.text}</Text>
            <Text style={style.hint}>预估</Text>
          </View>
          <View style={style.containerV}>
            <Text style={[styles.text, {color: transform.target.color}]}>{transform.target.text}</Text>
            <Text style={style.hint}>{transform.frequencyName}</Text>
          </View>
        </View>
        <Text style={style.hint}>{transform.detail}</Text>
      </TouchableOpacity>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 10,
    marginRight: 13,
    marginBottom: 8,
    backgroundColor: colors.light1,
    //borderTopWidth: 1,
    //borderTopColor: colors.light3,
    //borderRightWidth: 1,
    //borderRightColor: colors.light3,
    //borderBottomWidth: 1,
    //borderBottomColor: colors.light3,
    borderLeftWidth: 5,
    borderLeftColor: colors.border
  },
  containerF: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingLeft: 8,
    paddingRight: 8
  },
  containerVC: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.light3,
    borderRightWidth: 1,
    borderRightColor: colors.light3
  },
  containerV: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  hint: {
    flex: 1,
    fontSize: 12,
    marginLeft: 8,
    color: colors.border,
    paddingBottom: 4
  }
});
