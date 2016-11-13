/**
 * Created by Layman(http://github.com/anysome) on 16/3/21.
 */
import React from 'react';
import {View, Text, StyleSheet, Modal, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import {analytics, styles, colors, airloy, api, L, toast, hang} from '../../app';
import TimePicker from '../../widgets/TimePicker';

export default class Timer extends React.Component {

  constructor(props) {
    super(props);
    this.data = null;
    this.state = {
      date: new Date()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.data !== nextProps.data) {
      this.data = nextProps.data;
      if (this.data.reminder) {
        console.log(this.data.reminder);
        this.setState({
          date: moment(this.data.reminder, 'hh:mm:ss').toDate()
        });
      } else {
        this.setState({
          date: moment().add(1, 'hour').toDate()
        });
      }
    }
  }

  async _cancel() {
    if (this.props.data.reminder) {
      await this._setup(true);
    } else {
      this.props.onFeedback();
    }
  }

  _onSelectedDate(date) {
    this.setState({
      date: date
    });
  }

  async _setup(toCancel = false) {
    // upload change
    let param = toCancel ?
      {id: this.data.id} : {id: this.data.id, reminder: this.state.date};
    hang();
    let result = await airloy.net.httpGet(api.agenda.remind, param);
    hang(false);
    if (result.success) {
      this.data.reminder = result.info;
      this.props.onFeedback(this.data);
    } else {
      toast(L(result.message), 30);
    }
    analytics.onEvent('click_agenda_timer');
  }

  render() {
    return (
      <Modal animationType='slide' transparent={true} onRequestClose={() => this.props.onFeedback()} visible={this.props.visible}>
        <TouchableWithoutFeedback onPress={() => this.props.onFeedback()}>
          <View style={style.bg}/>
        </TouchableWithoutFeedback>
        <View style={style.container}>
          {this.props.data.reminder ?
            <Text style={style.title}>
              <Text style={styles.hint}>已设置提醒时间: </Text>
              {moment(this.props.data.today).format(' M月D日 ') + moment(this.props.data.reminder, 'hh:mm:ss').format('h:mm A') }
            </Text>
            :
            <Text style={style.title}>暂未设置提醒</Text>
          }
          <TimePicker date={this.state.date}
                      minuteInterval={5}
                      visible={true}
                      onDateChange={date => this._onSelectedDate(date)} />
          <View style={style.bar}>
            <Icon.Button name='md-close' color='white'
                         underlayColor='white'
                         backgroundColor={colors.border}
                         onPress={() => this.props.onFeedback()}>
              <Text style={style.text}>取消</Text>
            </Icon.Button>
            <Icon.Button name='md-notifications-off' color='white'
                         underlayColor='white'
                         backgroundColor={colors.accent}
                         onPress={()=> this._cancel()}>
              <Text style={style.text}>删除提醒</Text>
            </Icon.Button>
            <Icon.Button name='md-notifications' color='white'
                         underlayColor='white'
                         backgroundColor={colors.action}
                         onPress={()=> this._setup()}>
              <Text style={style.text}>设定</Text>
            </Icon.Button>
          </View>
        </View>
      </Modal>
    );
  }
}

const style = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.bright1
  },
  text: {
    color: 'white',
    fontSize: 16
  },
  title: {
    textAlign: 'center',
    color: colors.dark1,
    fontSize: 18
  },
  bar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  bg: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.3
  },
  link: {
    fontSize: 16,
    color: colors.action
  }
});
