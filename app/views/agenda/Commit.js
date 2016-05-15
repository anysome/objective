/**
 * Created by Layman(http://github.com/anysome) on 16/3/9.
 */
import React from 'react';
import {View, Text, StyleSheet, Modal, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {analytics, styles, colors, airloy, api, L, toast, hang} from '../../app';

import TextField from '../../widgets/TextField';
import TextArea from '../../widgets/TextArea';

export default class Commit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      toShare: false,
      shareable: false,
      editable: true,
      inputColor: colors.accent,
      output: '1',
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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.checkTargetId) {
      console.log('ids = ' + this.sharedTargetIds);
      this.state.toShare = this.sharedTargetIds.indexOf(nextProps.data.checkTargetId) > -1;
    } else {
      this.state.toShare = false;
    }
    if (nextProps.data.type === '0') {
      let shareable = nextProps.data.checkTargetId != null;
      let tip = shareable && this.state.toShare ? '我要分享...' : '记录一下...';
      this.setState({
        editable: false,
        shareable: shareable,
        inputColor: colors.border,
        remark: '',
        output: '1',
        tip: tip
      });
    } else {
      let tip = this.state.toShare ? '我要分享...' : '记录一下...';
      this.setState({
        editable: true,
        shareable: true,
        inputColor: colors.accent,
        remark: '',
        output: '',
        tip: tip
      });
    }

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
      let agenda = this.props.data;
      hang();
      let result = await airloy.net.httpPost(api.agenda.punch, {
        id: agenda.id,
        output: this.state.output,
        remark: this.state.remark,
        share: this.state.toShare
      });
      hang(false);
      if (result.success) {
        if (this.state.toShare) {
          if ( this.sharedTargetIds.indexOf(agenda.checkTargetId) < 0 ) {
            this.sharedTargetIds = this.sharedTargetIds + ',' + agenda.checkTargetId;
            airloy.store.setItem('target.commit.share.ids', this.sharedTargetIds);
          }
        } else {
          if ( this.sharedTargetIds.indexOf(agenda.checkTargetId) > -1 ) {
            this.sharedTargetIds = this.sharedTargetIds.replace(',' + agenda.checkTargetId, '');
            airloy.store.setItem('target.commit.share.ids', this.sharedTargetIds);
          }
        }
        if (agenda.checkDailyId) {
          airloy.event.emit('target.punch', {
            id: agenda.checkDailyId,
            times: parseInt(this.state.output)
          });
        }
        agenda.status = '1';
        agenda.doneTime = new Date();
        agenda.detail = this.state.remark;
        this.props.onFeedback(agenda);
      } else {
        toast(L(result.message));
      }
      analytics.onEvent('click_agenda_punch');
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
            { this.state.editable ?
            <TextField style={[style.input, {color: this.state.inputColor}]}
                       ref={c => this._output = c}
                       placeholder='今日完成数'
                       value={this.state.output}
                       keyboardType='number-pad'
                       onChangeText={text => this.setState({output: text})}/>
              : <View style={style.input}></View>
            }
            { this.state.shareable &&
            <TouchableWithoutFeedback onPress={() => this._switch()}>
              <Icon name={this.state.toShare ? 'toggle-filled' : 'toggle'}
                    size={36} style={style.icon}
                    color={ this.state.toShare ? colors.accent : colors.border}/>
            </TouchableWithoutFeedback>
            }
            <Icon.Button name='checkmark' color={colors.light1}
                         underlayColor={colors.light1}
                         backgroundColor={colors.accent}
                         onPress={()=> this._commit()}>
              <Text style={styles.buttonText}>完成</Text>
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
    marginTop: 5
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
