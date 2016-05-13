/**
 * Created by Layman(http://github.com/anysome) on 16/3/16.
 */
import React from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import Spinner from 'react-native-spinkit';
import moment from 'moment';

import CalendarView from '../../widgets/CalendarView';

import {analytics, styles, colors, airloy, api, toast, L} from '../../app';
import util from '../../libs/Util';

export default class Calendar extends React.Component {

  constructor(props) {
    let {data, ...others} = props;
    super(others);
    this.checkDaily = data;
    this.startDay = moment().add(-2, 'month').startOf('month');
    this.endDay = moment().endOf('month');
    this.today = moment();
    this.actives = new Map();
    this.notes = new Map();
    this.actives.set(new Date().getTime(), 'border');
    this.state = {
      loaded: false
    };
  }

  componentDidMount() {
    analytics.onPageStart('page_check_calendar');
    this.reload();
  }

  componentWillUnMount() {
    analytics.onPageEnd('page_check_calendar');
  }

  async reload() {
    let result = await airloy.net.httpGet(api.target.punchs, {
      id: this.checkDaily.checkTargetId,
      days: this.today.diff(this.startDay, 'days') + 1
    });
    if (result.success) {
      for (let punch of result.info) {
        this.actives.set(punch.checkTime, 'fill');
        punch.times > 1 && this.notes.set(punch.checkTime, punch.times);
      }
      this.setState({
        loaded: true
      });
    } else {
      toast(L(result.message));
    }
  }

  render() {
    return (
      <View style={style.flex}>
        <Text style={style.title}>{this.checkDaily.title}</Text>
        {this.state.loaded ?
          <CalendarView
            active={this.actives}
            note={this.notes}
            startDay={this.startDay}
            endDay={this.endDay}
            scrollTo={{x:0, y:760}}
          /> :
          <View style={[styles.containerC, {flex: 1, marginBottom: 100}]}>
            <Spinner isVisible={!this.state.loaded} size={100} type={'ChasingDots'} color={colors.accent}/>
          </View>
        }
      </View>
    );
  }
}


const style = StyleSheet.create({
  flex: {
    flex: 1,
    top: util.isAndroid() ? 0 : 65
  },
  title: {
    margin: 10,
    color: colors.dark2,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
