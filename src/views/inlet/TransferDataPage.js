/**
 * Created by Layman <anysome@gmail.com> (http://github.com/anysome) on 16/8/24.
 */

import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import Button from 'react-native-button';

import {styles, colors, airloy, api, hang, L, toast} from '../../app';

export default class TransferDataPage extends React.Component {

  constructor(props) {
    super(props);
    console.debug(props.onSigned);
    this.state = {
      stage: props.stage,
      text: '请先升级目标数据'
    };
  }

  componentDidMount() {
    console.debug('------------   ' + this.props.onSigned);
    this._setStage(this.props.stage);
  }

  _setStage(netStage) {
    let text = '请先升级目标数据';
    switch (netStage) {
      case 1:
        text = '请升级目标数据';
        break;
      case 2:
        text = '请升级分类清单数据';
        break;
      case 3:
        text = '请升级备忘数据';
        break;
      case 4:
        text = '请升级待办数据';
        break;
      case 5:
        text = '请升级指数数据';
        break;
      default:
        text = '进入新系统';
        break;
    }
    this.setState({
      stage: netStage,
      text: text
    });
  }

  async _transfer() {
    switch (this.state.stage) {
      case 1:
        this._doTransfer(api.transfer.target);
        break;
      case 2:
        this._doTransfer(api.transfer.project);
        break;
      case 3:
        this._doTransfer(api.transfer.chore);
        break;
      case 4:
        this._doTransfer(api.transfer.agenda);
        break;
      case 5:
        this._doTransfer(api.transfer.reward);
        break;
      default:
        let user = airloy.auth.getUser();
        user.transfer = this.state.stage;
        airloy.auth.updateUser(user);
        this.props.onSigned(this.state.stage);
    }
  }

  async _doTransfer(url) {
    hang();
    let result = await airloy.net.httpGet(url);
    hang(false);
    if (result.success) {
      this._setStage(result.info);
    } else {
      toast(L(result.message));
    }
  }

  render() {
    return (
      <View style={style.container}>
        <Button
          style={styles.buttonText}
          containerStyle={styles.button}
          activeOpacity={0.5}
          onPress={()=>this._transfer()}>
          {this.state.text}
        </Button>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light2,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold'
  }
});
