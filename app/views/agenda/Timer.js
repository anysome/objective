/**
 * Created by Layman(http://github.com/anysome) on 16/3/21.
 */

import React, {Component, View, Text, StyleSheet, Modal, DatePickerIOS, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import {styles, colors, airloy, api, L, toast} from '/../app/app';

import TextField from '/../app/widgets/TextField';
import TextArea from '/../app/widgets/TextArea';

export default class Timer extends Component {

    constructor(props) {
        super(props);
        this.data = null;
        this.state = {
            date: new Date()
        }
    }

    componentWillReceiveProps(nextProps) {
        if ( this.data !== nextProps.data ) {
            this.data = nextProps.data;
            if ( this.data.reminder ) {
                console.log(JSON.stringify(nextProps.data));
                this.setState({
                    date: new Date(nextProps.data.reminder)
                });
            } else {
                this.setState({
                    date: moment().add(1, 'hour').toDate()
                });
            }
            console.log(' reminder = ' + this.state.date);
        }
    }

    async _cancel() {
        if ( this.props.data.reminder ) {
            await this._setup(true);
        } else {
            this.props.onFeedback();
        }
    }

    _onSelectedDate(date) {
        console.log(' old reminder = ' + this.state.date);
        console.log(' new reminder = ' + date);
        this.setState({
            date: date
        });
    }

    async _setup(toCancel = false) {
        // upload change
        let param = toCancel ? {id: this.data.id} :{
                    id: this.data.id, reminder: moment(this.state.date).format('YYYY-MM-DD HH:mm:ss')
                };
        let result = await airloy.net.httpGet(api.agenda.remind, param);
        if (result.success) {
            this.data.reminder = result.info;
            this.props.onFeedback(this.data);
        } else {
            toast(L(result.message), 30);
        }
    }

    render() {
        return (
            <Modal animated={true} transparent={true} visible={this.props.visible}>
                <TouchableWithoutFeedback onPress={() => this.props.onFeedback()}>
                    <View style={style.bg} />
                </TouchableWithoutFeedback>
                <View style={style.container}>
                    <Text style={style.title}>{this.props.data.reminder ?
                        moment(this.props.data.reminder).format('当前提醒时间为  H:mm') : '暂未设置提醒'}</Text>
                    <DatePickerIOS
                        date={this.state.date}
                        mode="time"
                        minuteInterval={5}
                        onDateChange={date => this._onSelectedDate(date)}
                    />
                    <View style={style.bar}>
                        <Icon.Button name='android-notifications-off' color={colors.accent}
                                     underlayColor={colors.accent}
                                     backgroundColor={colors.light3}
                                     onPress={()=> this._cancel()} >
                            <Text style={styles.link}>取消提醒</Text>
                        </Icon.Button>
                        <Icon.Button name='android-notifications' color={colors.light1}
                                     underlayColor={colors.light1}
                                     backgroundColor={colors.accent}
                                     onPress={()=> this._setup()} >
                            <Text style={styles.buttonText}>设置</Text>
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
        paddingLeft: 30,
        paddingRight: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    bg: {
        flex:1,
        backgroundColor: 'black',
        opacity: 0.3
    }
});