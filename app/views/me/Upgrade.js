/**
 * Created by Layman(http://github.com/anysome) on 16/3/12.
 */
import React from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity} from 'react-native';
import Button from 'react-native-button';

import {analytics, styles, colors, airloy, api, L, toast, hang} from '../../app';
import TextField from '../../widgets/TextField';

export default class Setting extends React.Component {

  constructor(props) {
    var {onUpgraded, ...others} = props;
    super(others);
    this.onSigned = onUpgraded;
    this._email = null;
    this._password = null;
  }

  async _sign() {
    if (this._email.value.length < 5) {
      this._email.focus();
      return;
    }
    if (this._password.value.length < 6) {
      this._password.focus();
      return;
    }
    let user = {
      account: this._email.value,
      password: this._password.value,
      email: this._email.value,
      name: this._email.value
    };
    hang();
    let result = await airloy.net.httpPost(api.me.upgrade, user);
    if (result.success) {
      await airloy.auth.saveUser(result.info);
      this.onSigned();
      analytics.onEvent('user_upgrade');
    } else {
      toast(L(result.message));
    }
    hang(false);
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={style.text}>
          注册为同步帐号, 以免数据丢失而无法取回, 也可在安卓、苹果、网页间共享待办信息.
        </Text>
        <TextField
          ref={(c) => this._email = c}
          placeholder="使用邮箱注册和取回密码"
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={()=>this._password.focus()}
        />
        <TextField
          ref={(c) => this._password = c}
          placeholder="请妥善保存登录密码"
          secureTextEntry={true}
          returnKeyType="join"
          onSubmitEditing={()=>this._sign()}
        />
        <Button
          style={styles.buttonText}
          containerStyle={[styles.button, {marginTop: 20}]}
          activeOpacity={0.5}
          onPress={()=>this._sign()}>
          创建帐号
        </Button>
        <Text style={style.text}>
          注册成功后, 使用新的帐号在其它设备登录能够获取目前所有的数据.
        </Text>
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    marginTop: 20,
    color: colors.border,
    fontSize: 14
  },
  body: {
    flex: 1,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light1,
    borderBottomWidth: 1,
    borderBottomColor: colors.light1,
    backgroundColor: colors.light2
  }
});
