/**
 * Created by Layman(http://github.com/anysome) on 16/2/20.
 */
'use strict';

import React, {
    Component,
    View,
    Text,
    StyleSheet,
    Dimensions,
    LayoutAnimation
} from 'react-native';
import Button from 'react-native-button';

import TextField from '/../app/widgets/TextField';
import ResetPassword from './ResetPassword';

import app, {colors, styles, api, airloy, L, toast} from '/../app/app';



export default class Login extends Component {

    constructor(props) {
        var {onSigned, ...others} = props;
        super(others);
        this.onSigned = onSigned;
        this._email = null;
        this._password = null;
        this.state = {
            isKeyboardOpened: false,
            visibleHeight: Dimensions.get('window').height,
            openModal: false
        };
    }

    componentDidMount() {
        airloy.event.on('keyboardWillShow', (e) => {
            let newSize = Dimensions.get('window').height - e.endCoordinates.height;
            this.setState({
                isKeyboardOpened: true,
                visibleHeight: newSize
            });
        });
        airloy.event.on('keyboardWillHide', (e) => {
            this.setState({
                isKeyboardOpened: false,
                visibleHeight: Dimensions.get('window').height
            });
        });
    }

    componentWillUnmount() {
        airloy.event.off('keyboardWillShow', 'keyboardWillHide');
    }

    componentWillUpdate(props, state) {
        if (state.isKeyboardOpened !== this.state.isKeyboardOpened) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
    }

    async _login() {
        if ( this._email.value.length < 5) {
            this._email.focus();
            return;
        }
        if ( this._password.value.length < 6) {
            this._password.focus();
            return;
        }
        let user = airloy.auth.formUser(this._email.value, this._password.value);
        let result = await airloy.net.httpPost(api.public.login, user);
        if ( result.success ) {
            await airloy.auth.saveUser(result.info);
            this.onSigned();
        } else {
            toast(L(result.message));
        }
    }

    async _justIn() {
        let user = airloy.auth.formUser(airloy.device.getIdentifier(), '');
        let result = await airloy.net.httpPost(api.public.taste, user);
        if ( result.success ) {
            await airloy.auth.saveUser(result.info);
            this.onSigned();
        } else {
            toast(L(result.message));
        }
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
                <View style={[style.container, {height: this.state.visibleHeight}]}>
                    <View style={style.body}>
                        <Text style={{alignSelf:'center', color:colors.dark1, margin: 10}}>HELP TO DO,  NOT TO NOTE!</Text>
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
                <ResetPassword visible={this.state.openModal} onBack={()=> this.closeModal()} />
            </View>
        );
    }
}

const style = StyleSheet.create({
    window: {
        flex: 1,
        backgroundColor: colors.light3
    },
    container:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center'
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