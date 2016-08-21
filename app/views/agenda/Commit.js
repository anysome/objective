/**
 * Created by Layman(http://github.com/anysome) on 16/3/9.
 */
import React from 'react';
import {View, Text, StyleSheet, Modal, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {analytics, styles, colors, airloy, api, L, toast, hang} from '../../app';
import EventTypes from '../../logic/EventTypes';
import TextField from '../../widgets/TextField';
import TextArea from '../../widgets/TextArea';

export default class Commit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editable: true,
      inputColor: colors.accent,
      output: '1',
      remark: '',
      tip: '记录一下...'
    };
    this._output = null;
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.data.doneType === '0') {
      this.setState({
        editable: false,
        inputColor: colors.border,
        remark: '',
        output: '1'
      });
    } else {
      this.setState({
        editable: true,
        inputColor: colors.accent,
        remark: '',
        output: ''
      });
    }
  }

  async _commit() {
    if (this.state.output) {
      let agenda = this.props.data;
      let amount = parseInt(this.state.output);
      hang();
      let result = await airloy.net.httpPost(api.agenda.finish, {
        id: agenda.id,
        amount: amount,
        remark: this.state.remark
      });
      hang(false);
      if (result.success) {
        if (agenda.targetId) {
          airloy.event.emit(EventTypes.targetPunch, {
            id: agenda.targetId,
            amonut: amount,
            roundDateEnd: agenda.roundDateEnd
          });
        }
        agenda.projectId && airloy.event.emit(EventTypes.taskChange);

        agenda.status = '1';
        agenda.doneTime = new Date();
        agenda.detail = this.state.remark;
        this.props.onFeedback(agenda);
      } else {
        toast(L(result.message));
      }
      analytics.onEvent('click_agenda_punch');
    } else {
      this.setState({output: '1'});
      this._output.focus();
    }
  }

  render() {
    return (
      <Modal animationType='slide' transparent={true} onRequestClose={() => this.props.onFeedback()} visible={this.props.visible}>
        <View style={style.container}>
          <Text style={style.title}>{this.props.data.title}</Text>
                    <TextArea placeholder={this.state.tip}
                              defaultValue={this.state.remark}
                              onChangeText={text => this.setState({remark: text})}/>
          <View style={style.bar}>
            { this.state.editable ?
            <TextField style={[style.input, {color: this.state.inputColor}]}
                       ref={c => this._output = c}
                       placeholder='今日完成数'
                       defaultValue={this.state.output}
                       keyboardType='number-pad'
                       onChangeText={text => this.setState({output: text})}/>
              : <View style={style.input}></View>
            }
            <Icon.Button name='md-checkmark' color={colors.light1}
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
    backgroundColor: colors.light2
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
