/**
 * Created by Layman <anysome@gmail.com> (http://github.com/anysome) on 2016/11/9.
 */
import React from 'react';
import {View, StyleSheet, Image, Text, Dimensions, TouchableOpacity, Keyboard, LayoutAnimation} from 'react-native';
import {analytics, styles, colors, airloy, api, toast, L, hang} from '../../app';
import Button from 'react-native-button';
import TextField from '../../widgets/TextField';
import ResetPassword from './ResetPassword';

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.onSigned = props.onSigned;
    this._email = null;
    this._password = null;
    this.state = {
      isKeyboardOpened: false,
      visibleHeight: Dimensions.get('window').height,
      openModal: false
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
      let newSize = Dimensions.get('window').height - e.endCoordinates.height;
      this.setState({
        isKeyboardOpened: true,
        visibleHeight: newSize
      });
    });
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', e => {
      this.setState({
        isKeyboardOpened: false,
        visibleHeight: Dimensions.get('window').height
      });
    });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentWillUpdate(props, state) {
    if (state.isKeyboardOpened !== this.state.isKeyboardOpened) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }

  async _weiboLogin() {
    console.log('weibo login');
  }

  async _login() {
    if (this._email.value.length < 5) {
      this._email.focus();
      return;
    }
    if (this._password.value.length < 6) {
      this._password.focus();
      return;
    }
    hang();
    let user = airloy.auth.formUser(this._email.value, this._password.value);
    let result = await airloy.net.httpPost(api.public.sign, user);
    if (result.success) {
      await airloy.auth.saveUser(result.info);
      // analytics.onProfileSignIn('' + result.info.id);
      this.onSigned(result.info.transfer);
    } else {
      toast(L(result.message), 70);
    }
    hang(false);
  }

  async _justIn() {
    hang();
    let user = airloy.auth.formUser(airloy.device.getIdentifier(), '');
    let result = await airloy.net.httpPost(api.public.try, user);
    if (result.success) {
      await airloy.auth.saveUser(result.info);
      // analytics.onProfileSignIn('' + result.info.id);
      this.onSigned(result.info.transfer);
    } else {
      toast(L(result.message), 70);
    }
    hang(false);
  }

  openModal() {
    this.setState({openModal: true});
    console.log(' to open modal');
  }

  closeModal() {
    this.setState({openModal: false});
    console.log(' to close modal');
  }

  render() {
    return (
      <View style={style.window}>
        <View style={[styles.containerC, {height: this.state.visibleHeight}]}>
          <View style={style.body}>
            <View style={style.containerA}>
              <TouchableOpacity onPress={()=>this._weiboLogin()}>
                <Image style={style.third} source={require('../../../resources/images/weibo.png')}/>
              </TouchableOpacity>
              <Text style={styles.hint}>第三方帐号登录</Text>
            </View>
            <TextField
              ref={(c) => this._email = c}
              placeholder="注册邮箱 / 登录名"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={()=>this._password.focus()}
            />
            <TextField
              ref={(c) => this._password = c}
              placeholder="密码"
              secureTextEntry={true}
              returnKeyType="join"
              onSubmitEditing={()=>this._login()}
            />
            <Button
              style={styles.buttonText}
              containerStyle={[styles.button, {marginTop: 20}]}
              activeOpacity={0.5}
              onPress={()=>this._login()}>
              注册 / 登录
            </Button>
            <View style={[styles.containerF, {paddingTop:10, paddingBottom:10}]}>
              <Button style={style.link} onPress={()=>this.openModal()}>
                忘记密码 ?
              </Button>
              <Button style={style.link} onPress={()=>this._justIn()}>
                直接使用 &gt;&gt;
              </Button>
            </View>
          </View>
        </View>
        <ResetPassword visible={this.state.openModal} onBack={()=> this.closeModal()}/>
      </View>
    );
  }
}

const style = StyleSheet.create({
  window: {
    flex: 1,
    backgroundColor: colors.light3
  },
  body: {
    flex: 1,
    height: 350,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light1,
    borderBottomWidth: 1,
    borderBottomColor: colors.light1,
    backgroundColor: colors.light2
  },
  containerA: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.light3
  },
  third: {
    width: 64,
    height: 64,
    marginBottom: 10
  },
  link: {
    flex: 1,
    fontSize: 12,
    color: colors.dark1
  }
});
