/**
 * Created by Layman(http://github.com/anysome) on 16/3/4.
 */
'use strict';

import React, {Component, ScrollView, View, Text, TouchableOpacity, Image} from 'react-native';

import {styles, colors, airloy, config, api, toast, L} from '/../app/app';

import TextField from '/../app/widgets/TextField';
import TextArea from '/../app/widgets/TextArea';

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.user = airloy.auth.getUser();
        this.info = {
            id: this.user.id,
            name: this.user.name
        };
        this.state = {
            name: this.user.name,
            signature: '',
            email: this.user.email
        };
    }

    componentDidMount() {
        this.reload();
    }

    async reload() {
        let result = await airloy.net.httpGet(api.discover.user.info);
        if ( result.success ) {
            this.info = result.info;
            this.setState({
                name: this.info.name,
                signature: this.info.signature,
                email: this.info.email
            });
        } else {
            toast(L(result.message));
        }
    }

    _selectImage() {
        console.log(' next time implement');
    }

    async _save() {
        if ( this.state.name ) {
            this.info.name = this.state.name;
        }
        if ( this.state.email ) {
            this.info.email = this.state.email;
        }
        if ( this.state.signature ) {
            this.info.signature = this.state.signature;
        }
        let result = await airloy.net.httpPost(api.discover.user.info, this.info);
        if ( result.success ) {
            this.props.onUpdated(this.info.name);
        } else {
            toast(L(result.message));
        }
    }

    render() {
        return (
            <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps>
                <View style={styles.row}>
                    <Text>头像</Text>
                    <Image style={{width:60, height:60}}
                           source={{uri:`${config.host.avatar + this.user.id}-100`}}
                           defaultSource={require('/../resources/images/avatar.png')} />
                </View>
                <View style={styles.section}>
                    <TextField
                        flat={true}
                        value={this.state.name}
                        onChangeText={(text) => this.setState({name:text})}
                        placeholder='昵称'
                        returnKeyType="default"
                    />
                    <View style={styles.separator} />
                    <TextField
                        flat={true}
                        value={this.state.email}
                        onChangeText={(text) => this.setState({email:text})}
                        placeholder='邮箱'
                        returnKeyType="default"
                    />
                    <View style={styles.separator} />
                    <TextArea
                        flat={true}
                        value={this.state.signature}
                        onChangeText={(text) => this.setState({signature:text})}
                        placeholder='个性签名'
                        returnKeyType="default"
                    />
                </View>
                <TouchableOpacity style={styles.row} onPress={()=> this._save()}>
                    <Text style={styles.link}>保存</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}