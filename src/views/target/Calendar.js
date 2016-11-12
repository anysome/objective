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
    super(props);
    if ( props.target ) {
      this.startDay = moment(props.target.dateEnd).add(-6, 'month').startOf('month');
      this.endDay = moment(props.target.dateEnd).endOf('month');
      this.targetId = props.target.id;
      this.title = props.target.title;
    } else {
      this.startDay = moment().add(-2, 'month').startOf('month');
      this.endDay = moment().endOf('month');
      this.targetId = props.targetId;
      this.title = props.title;
    }
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

  componentWillUnmount() {
    analytics.onPageEnd('page_check_calendar');
  }

  async reload() {
    let result = await airloy.net.httpGet(api.agenda.list.target, {
      targetId: this.targetId,
      days: this.today.diff(this.startDay, 'days') + 1
    });
    if (result.success) {
      for (let punch of result.info) {
        switch (punch.doneAmount) {
          case 0:
            this.actives.set(punch.today, 'border');
            break;
          case 1:
            this.actives.set(punch.today, 'fill');
            break;
          default:
            this.actives.set(punch.today, 'fill');
            this.notes.set(punch.today, punch.doneAmount);
            break;
        }
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
        <Text style={style.title}>{this.title}</Text>
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
