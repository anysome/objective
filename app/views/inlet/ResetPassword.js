/**
 * Created by Layman(http://github.com/anysome) on 16/3/5.
 */
import React from 'react';
import {StyleSheet, Modal, View} from 'react-native';
import Button from 'react-native-button';

import {styles, colors, airloy, api, L, toast, hang} from '../../app';
import TextField from '../../widgets/TextField';


export default class ResetPassword extends React.Component {

  constructor(props) {
    super(props);
    this._email = null;
    this._account = null;
    this._code = null;
    this._pwd1 = null;
    this._pwd2 = null;
    this.state = {
      showReset: false
    };
  }

  async _auth() {
    console.log(' to get auth');
    if (this._email.value.length < 5) {
      this._email.focus();
      return;
    }
    if (this._account.value.length < 5) {
      this._account.focus();
      return;
    }
    hang();
    let result = await airloy.net.httpPost(api.public.auth, {
      account: this._account.value,
      email: this._email.value
    });
    hang(false);
    if (result.success) {
      toast('请收取邮件获取授权码', 70);
    } else {
      toast(L(result.message), 70);
    }
  }

  _toReset() {
    this.setState({showReset: true});
  }

  _toAuth() {
    this.setState({showReset: false});
  }

  async _reset() {
    if (this._account.value.length < 5) {
      this._account.focus();
      return;
    }
    if (this._code.value.length < 6) {
      this._code.focus();
      return;
    }
    if (this._pwd1.value.length < 6) {
      this._pwd1.focus();
      return;
    }
    if (this._pwd1.value !== this._pwd2.value) {
      this._pwd2.focus();
      return;
    }
    hang();
    let result = await airloy.net.httpPost(api.public.resetPassword, {
      account: this._account.value,
      code: this._code.value,
      password: this._pwd1.value
    });
    hang(false);
    if (result.success) {
      toast('修改成功.', 70);
      this.props.onBack();
    } else {
      toast(L(result.message), 70);
    }
  }

  render() {
    return (
      <Modal animated={true} transparent={false} visible={this.props.visible}>
        <View style={styles.modal}>
          <View style={style.container}>
            { this.state.showReset ?
              <View style={style.body}>
                <TextField
                  ref={(c) => this._account = c}
                  placeholder='登录名, 可能是邮箱'
                  keyboardType='email-address'
                  returnKeyType='next'
                  onSubmitEditing={()=>this._code.focus()}
                />
                <TextField
                  ref={(c) => this._code = c}
                  placeholder='授权码'
                  keyboardType='email-address'
                  returnKeyType='next'
                  onSubmitEditing={()=>this._pwd1.focus()}
                />
                <TextField
                  ref={(c) => this._pwd1 = c}
                  placeholder="新密码"
                  secureTextEntry={true}
                  returnKeyType="next"
                  onSubmitEditing={()=>this._pwd2.focus()}
                />
                <TextField
                  ref={(c) => this._pwd2 = c}
                  placeholder="确认密码"
                  secureTextEntry={true}
                  returnKeyType="done"
                  onSubmitEditing={()=>this._reset()}
                />
                <Button
                  style={styles.buttonText}
                  containerStyle={[styles.button, {marginTop: 20}]}
                  activeOpacity={0.5}
                  onPress={()=>this._reset()}>
                  修改密码
                </Button>
                <View
                  style={[styles.containerH, {justifyContent:'space-between', paddingTop:10, paddingBottom:10}]}>
                  <Button style={style.link} onPress={this.props.onBack}>
                    返回登录
                  </Button>
                  <Button style={style.link} onPress={()=>this._toAuth()}>
                    获取授权码
                  </Button>
                </View>
              </View>
              :
              <View style={style.body}>
                <TextField
                  ref={(c) => this._account = c}
                  placeholder='登录名, 可能是邮箱'
                  keyboardType='email-address'
                  returnKeyType='next'
                  onSubmitEditing={()=>this._email.focus()}
                />
                <TextField
                  ref={(c) => this._email = c}
                  placeholder="注册时使用的邮箱"
                  keyboardType="email-address"
                  returnKeyType="send"
                  onSubmitEditing={()=>this._auth()}
                />
                <Button
                  style={styles.buttonText}
                  containerStyle={[styles.button, {marginTop: 20}]}
                  activeOpacity={0.5}
                  onPress={()=>this._auth()}>
                  获取授权码
                </Button>
                <View
                  style={[styles.containerH, {justifyContent:'space-between', paddingTop:10, paddingBottom:10}]}>
                  <Button style={style.link} onPress={this.props.onBack}>
                    返回登录
                  </Button>
                  <Button style={style.link} onPress={()=>this._toReset()}>
                    修改密码
                  </Button>
                </View>
              </View>
            }
          </View>
        </View>
      </Modal>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  body: {
    flex: 1,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light1,
    borderBottomWidth: 1,
    borderBottomColor: colors.light1,
    backgroundColor: colors.light2
  },
  link: {
    flex: 1,
    fontSize: 12,
    color: colors.dark1
  }
});
