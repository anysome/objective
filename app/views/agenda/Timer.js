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
        this.setState({
          date: new Date(nextProps.data.reminder)
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
      {id: this.data.id} : {id: this.data.id, reminder: moment(this.state.date).format('YYYY-MM-DD HH:mm:ss')};
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
      <Modal animated={true} transparent={true} onRequestClose={() => {}} visible={this.props.visible}>
        <TouchableWithoutFeedback onPress={() => this.props.onFeedback()}>
          <View style={style.bg}/>
        </TouchableWithoutFeedback>
        <View style={style.container}>
          {this.props.data.reminder ?
            <Text style={style.title}>
              <Text style={styles.hint}>已设置提醒时间: </Text>
              {moment(this.props.data.today).format(' M月D日 ') + moment(this.props.data.reminder).format('h:mm A') }
            </Text>
            :
            <Text style={style.title}>暂未设置提醒</Text>
          }
          <TimePicker date={this.state.date}
                      minuteInterval={5}
                      visible={true}
                      onDateChange={date => this._onSelectedDate(date)} />
          <View style={style.bar}>
            <Icon.Button name='close' color={colors.light3}
                         underlayColor={colors.light1}
                         backgroundColor={colors.light2}
                         onPress={() => this.props.onFeedback()}>
              <Text style={styles.text}>取消</Text>
            </Icon.Button>
            <Icon.Button name='android-notifications-off' color={colors.accent}
                         underlayColor={colors.light1}
                         backgroundColor={colors.light2}
                         onPress={()=> this._cancel()}>
              <Text style={styles.link}>删除提醒</Text>
            </Icon.Button>
            <Icon.Button name='android-notifications' color={colors.light1}
                         underlayColor={colors.light1}
                         backgroundColor={colors.accent}
                         onPress={()=> this._setup()}>
              <Text style={styles.buttonText}>设定</Text>
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
    backgroundColor: colors.light1
  },
  title: {
    textAlign: 'center',
    color: colors.dark3,
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
  }
});
