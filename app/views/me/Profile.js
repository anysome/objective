/**
 * Created by Layman(http://github.com/anysome) on 16/3/4.
 */
'use strict';

import React, {Component, ScrollView, View, Text, TouchableOpacity, Image} from 'react-native';
let ImagePickerManager = require('NativeModules').ImagePickerManager;

import {analytics, styles, colors, airloy, config, api, toast, L, hang} from '../../app';
import util from '../../libs/Util';

import TextField from '../../widgets/TextField';
import TextArea from '../../widgets/TextArea';

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
    // TODO
    let options = {
      title: 'Select Avatar', // specify null or empty string to remove the title
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      durationLimit: 10, // video recording max time in seconds
      maxWidth: 100, // photos only
      maxHeight: 100, // photos only
      aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      quality: 0.2, // 0 to 1, photos only
      angle: 0, // android only, photos only
      allowsEditing: false, // Built in functionality to resize/reposition the image after selection
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images' // ios only - will save image at /Documents/images rather than the root
      }
    };
    let self = this;
    ImagePickerManager.showImagePicker(options, async (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      } else {
        const fileUri = util.isAndroid() ? response.uri : response.uri.replace('file://', '');
        hang();
        let result = await airloy.net.httpGet(api.me.token.avatar);
        if (result.success) {
          let formData = new FormData();
          formData.append('file', {uri: fileUri, type: 'application/octet-stream ', name: self.user.id});
          formData.append('key', 'avatar/' + self.user.id);
          formData.append('token', result.info);
          fetch(config.host.upload, {
            method: 'POST',
            body: formData
          }).then(resp => {
            if (resp.ok ) {
              self.setState({
                avatar: fileUri
              });
              // TODO reset avatar cache
            } else {
              toast('Upload error code: ' + resp.status);
            }
          }).catch(error => {
            toast(error);
          });
        } else {
          toast(L(result.message));
        }
        hang(false);
      }
    });
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
