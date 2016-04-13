/**
 * Created by Layman(http://github.com/anysome) on 16/3/9.
 */
'use strict';

import React, {Component, View, Text, StyleSheet, Modal, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {styles, colors, airloy, api, L, toast} from '../../app';

import TextField from '../../widgets/TextField';
import TextArea from '../../widgets/TextArea';

export default class Commit extends Component {

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
    }

    componentWillReceiveProps(nextProps) {
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
            let tip = this.state.toShare ? '我要分享...' : '记录一下...' ;
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
        if ( this.state.output ) {
            let agenda = this.props.data;
            let result = await airloy.net.httpPost(api.agenda.done, {
                    id: agenda.id,
                    output: this.state.output,
                    remark: this.state.remark,
                    share: this.state.toShare
                });
            if (result.success) {
                if ( agenda.checkDailyId ) {
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
        } else {
            this._output.focus();
        }
    }
    render() {
        return (
            <Modal animated={true} transparent={true} visible={this.props.visible}>
                <View style={style.container}>
                    <Text style={style.title}>{this.props.data.title}</Text>
                    <TextArea placeholder={this.state.tip}
                              value={this.state.remark}
                              onChangeText={text => this.setState({remark: text})} />
                    <View style={style.bar}>
                        <TextField style={[style.input, {color: this.state.inputColor}]}
                                   ref={c => this._output = c}
                                   placeholder='今日完成数'
                                   value={this.state.output}
                                   editable={this.state.editable}
                                   keyboardType='number-pad'
                                   onChangeText={text => this.setState({output: text})} />
                        { this.state.shareable &&
                            <TouchableWithoutFeedback onPress={() => this._switch()}>
                                <Icon name={this.state.toShare ? 'toggle-filled' : 'toggle'}
                                      size={36} style={style.icon}
                                      color={ this.state.toShare ? colors.accent : colors.border} />
                            </TouchableWithoutFeedback>
                        }
                        <Icon.Button name='checkmark' color={colors.light1}
                                     underlayColor={colors.light1}
                                     backgroundColor={colors.accent}
                                     onPress={()=> this._commit()} >
                            <Text style={styles.buttonText}>完成</Text>
                        </Icon.Button>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={() => this.props.onFeedback()}>
                    <View style={style.bg} />
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
        flex:1,
        backgroundColor: 'black',
        opacity: 0.3
    }
});