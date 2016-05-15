/**
 * Created by Layman(http://github.com/anysome) on 16/3/9.
 */
import React from 'react';
import {View, Text, StyleSheet, Modal, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {analytics, styles, colors, airloy, api, L, toast, hang} from '../../app';

import TextField from '../../widgets/TextField';
import TextArea from '../../widgets/TextArea';

export default class Punch extends React.Component {

  constructor(props) {
    let {data, onFeedback, ...others} = props;
    super(others);
    this.checkDaily = data;
    this.state = {
      toShare: false,
      output: data.unit === '0' ? '1' : '',
      remark: '',
      tip: '记录一下...'
    };
    this._output = null;
    this.sharedTargetIds = null;
    this._init();
  }

  async _init() {
    this.sharedTargetIds = await airloy.store.getItem('target.commit.share.ids');
    this.sharedTargetIds || (this.sharedTargetIds = 'shared:');
    console.log('ids = ' + this.sharedTargetIds);
    this.state.toShare = this.sharedTargetIds.indexOf(this.checkDaily.checkTargetId) > -1;
    console.log(' to share = ' + this.state.toShare);
  }

  _switch() {
    let tipText = this.state.toShare ? '记录一下...' : '我要分享...';
    this.setState({
      toShare: !this.state.toShare,
      tip: tipText
    });
  }

  async _commit() {
    if (this.state.output) {
      let increasement = parseInt(this.state.output);
      hang();
      let result = await airloy.net.httpPost(api.target.punch, {
        id: this.checkDaily.checkTargetId,
        times: increasement,
        remark: this.state.remark,
        share: this.state.toShare
      });
      hang(false);
      if (result.success) {
        if (this.state.toShare) {
          if (this.sharedTargetIds.indexOf(this.checkDaily.checkTargetId) < 0) {
            this.sharedTargetIds = this.sharedTargetIds + ',' + this.checkDaily.checkTargetId;
            airloy.store.setItem('target.commit.share.ids', this.sharedTargetIds);
          }
        } else {
          if (this.sharedTargetIds.indexOf(this.checkDaily.checkTargetId) > -1) {
            this.sharedTargetIds = this.sharedTargetIds.replace(',' + this.checkDaily.checkTargetId, '');
            airloy.store.setItem('target.commit.share.ids', this.sharedTargetIds);
            console.log('new ids after cancel ' + this.sharedTargetIds);
          }
        }
        toast('太给力了!');
        airloy.event.emit('agenda.change');
        airloy.event.emit('target.change');
        this.checkDaily.times = this.checkDaily.times + increasement;
        this.props.onFeedback(this.checkDaily);
      } else {
        toast(L(result.message));
      }
      analytics.onEvent('click_check_punch');
    } else {
      this._output.focus();
    }
  }

  render() {
    return (
      <Modal animated={true} transparent={true} onRequestClose={() => {}} visible={this.props.visible}>
        <View style={style.container}>
          <Text style={style.title}>{this.props.data.title}</Text>
                    <TextArea placeholder={this.state.tip}
                              value={this.state.remark}
                              onChangeText={text => this.setState({remark: text})}/>
          <View style={style.bar}>
            <TextField style={style.input}
                       ref={c => this._output = c}
                       placeholder='新增完成数'
                       value={this.state.output}
                       keyboardType='number-pad'
                       onChangeText={text => this.setState({output: text})}/>
            <TouchableWithoutFeedback onPress={() => this._switch()}>
              <Icon name={this.state.toShare ? 'toggle-filled' : 'toggle'}
                    size={36} style={style.icon}
                    color={ this.state.toShare ? colors.accent : colors.border}/>
            </TouchableWithoutFeedback>
            <Icon.Button name='checkmark' color={colors.light1}
                         underlayColor={colors.light1}
                         backgroundColor={colors.accent}
                         onPress={()=> this._commit()}>
              <Text style={styles.buttonText}>打卡</Text>
            </Icon.Button>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={() => this.props.onFeedback()}>
          <View style={style.bg}/>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const style = StyleSheet.create({
  container: {
    height: 220,
    padding: 20,
    backgroundColor: colors.light1
  },
  title: {
    paddingTop: 4,
    paddingBottom: 4,
    color: colors.dark3,
    fontSize: 18
  },
  input: {
    flex: 1,
    marginRight: 16,
    marginTop: 5,
    color: colors.accent
  },
  icon: {
    marginRight: 16
  },
  bar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },
  bg: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.3
  }
});
