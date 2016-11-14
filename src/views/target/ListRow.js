/**
 * Created by Layman(http://github.com/anysome) on 16/3/10.
 */
import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import moment from 'moment';

import {colors, styles, px1} from '../../app';
import objective from '../../logic/Objective';

export default class ListRow extends React.Component {

  constructor(props) {
    super(props);
  }

  _transform(target) {
    let dateEnd = moment(target.dateEnd);
    let unitName = objective.getUnitName(target.unit);
    let maybe = '';
    let undoSize = 26, doneColor = colors.dark2;
    if (target.requiredAmount === 1) {
      if (target.doneAmount) {
        undoSize = 14;
        doneColor = colors.border;
      }
    } else {
      if (target.doneAmount) {
        undoSize = 14;
        doneColor = colors.border;
      }
    }
    if (target.frequency === '1') {
      maybe = '1 天 ' + target.requiredAmount + unitName;
    } else {
      let ms = target.roundDateEnd - this.props.today;
      let checkLeftDays = 1;
      if (ms > 0) {
        checkLeftDays = ms / 86400000 + 1;
      }
      let lefts = target.requiredAmount - target.roundTotal;
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
    let frequencyName = objective.getFrequencyName(target.frequency);
    return {
      priorityColor: objective.getPriorityColor(target.priority),
      title: target.title,
      detail: target.detail,
      timeLeft: dateEnd.add(1, 'days').fromNow(),
      progress: target.doneTotal,
      maybe: maybe,
      undoSize: undoSize,
      doneColor: doneColor,
      arrangedColor: target.arranged ? colors.border : colors.dark2,
      summary: `${frequencyName} ${target.requiredAmount} ${unitName}`
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
    backgroundColor: 'white',
    borderLeftWidth: 6,
    borderLeftColor: colors.border,
    borderTopWidth: px1,
    borderTopColor: colors.bright2,
    borderBottomWidth: px1,
    borderBottomColor: colors.bright2
  },
  title: {
    flex: 1,
    color: colors.dark1,
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
