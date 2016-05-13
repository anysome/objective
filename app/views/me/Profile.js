/**
 * Created by Layman(http://github.com/anysome) on 16/3/4.
 */
import React from 'react';
import {ScrollView, View, Text, TouchableOpacity, Image} from 'react-native';

import {analytics, styles, airloy, config, api, toast, L, hang} from '../../app';

import TextField from '../../widgets/TextField';
import TextArea from '../../widgets/TextArea';

export default class Profile extends React.Component {

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
      email: this.user.email,
      avatar: config.host.avatar + this.user.id + '-100'
    };
  }

  componentDidMount() {
    analytics.onPageStart('page_profile');
    this.reload();
  }

  componentWillUnMount() {
    analytics.onPageEnd('page_profile');
  }

  async reload() {
    let result = await airloy.net.httpGet(api.discover.user.info);
    if (result.success) {
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

  }

  async _save() {
    if (this.state.name) {
      this.info.name = this.state.name;
    }
    if (this.state.email) {
      this.info.email = this.state.email;
    }
    if (this.state.signature) {
      this.info.signature = this.state.signature;
    }
    hang();
    let result = await airloy.net.httpPost(api.discover.user.info, this.info);
    hang(false);
    if (result.success) {
      this.props.onUpdated(this.info.name);
    } else {
      toast(L(result.message));
    }
  }

  render() {
    return (
      <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps>
        <TouchableOpacity style={styles.row} onPress={() => this._selectImage()}>
          <Text>头像</Text>
          <Image style={{width:60, height:60}}
                 source={{uri: this.state.avatar}}
                 defaultSource={require('../../../resources/images/avatar.png')}/>
        </TouchableOpacity>
        <View style={styles.section}>
          <TextField
            flat={true}
            value={this.state.name}
            onChangeText={(text) => this.setState({name:text})}
            placeholder='昵称'
            returnKeyType="default"
          />
          <View style={styles.separator}/>
          <TextField
            flat={true}
            value={this.state.email}
            onChangeText={(text) => this.setState({email:text})}
            placeholder='邮箱'
            returnKeyType="default"
          />
          <View style={styles.separator}/>
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
