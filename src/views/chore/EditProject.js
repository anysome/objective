/**
 * Created by Layman(http://github.com/anysome) on 16/8/30.
 */

import React from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity, Alert} from 'react-native';
import Button from 'react-native-button';

import {analytics, styles, colors, airloy, api, L, toast, hang} from '../../app';
import util from '../../libs/Util';
import EventTypes from '../../logic/EventTypes';
import TextField from '../../widgets/TextField';
import TextArea from '../../widgets/TextArea';

export default class EditProject extends React.Component {

  constructor(props) {
    super(props);
    this._title = null;
    this.data = props.data || {title: ''};
    this.state = {
      title: this.data.title,
      detail: this.data.detail
    };
  }

  componentWillMount() {
    let route = this.props.navigator.navigationContext.currentRoute;
    if (route.rightButtonIcon) {
      route.onRightButtonPress = () => {
        Alert.alert(
          '确认删除 ?',
          this.data.subTodo > 0 ? '未完成的任务可在回收站里找到.' : '彻底删除了哦!',
          [
            {text: '不了'},
            {
              text: '删除',
              onPress: async () => {
                hang();
                let result = await airloy.net.httpGet(api.project.remove, {id: this.data.id});
                if (result.success) {
                  this.data.subTodo && airloy.event.emit(EventTypes.choreChange);
                  this.props.onDeleted(this.data);
                } else {
                  toast(L(result.message));
                }
                hang(false);
              }
            }
          ]
        );
      };
      // so many bugs on android T_T
      util.isAndroid() ?
        this.props.navigator.replaceAtIndex(route, -1) :
        this.props.navigator.replace(route);
    }
  }

  async _save() {
    let result;
    this.data.detail = this.state.detail;
    if (this.data.id) {
      if (this._title.value.length > 0) {
        this.data.title = this.state.title;
      }
      hang();
      result = await airloy.net.httpPost(api.project.update, this.data);
    } else {
      if (this._title.value.length < 1) {
        this._title.focus();
        return;
      }
      this.data.title = this.state.title;
      hang();
      result = await airloy.net.httpPost(api.project.add, this.data);
    }
    hang(false);
    if (result.success) {
      this.props.onUpdated(result.info);
    } else {
      toast(L(result.message));
    }
    analytics.onEvent('click_project_save');
  }

  render() {
    return (
      <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps>
        <View style={styles.section}>
          <TextField
            ref={c => this._title = c}
            flat={true}
            defaultValue={this.state.title}
            onChangeText={(text) => this.setState({title:text})}
            placeholder={this.data.title || '清单名...'}
            returnKeyType="done"
            autoFocus={this.data.title === ''}
          />
          <View style={styles.separator}/>
                    <TextArea
                      flat={true}
                      defaultValue={this.state.detail}
                      onChangeText={(text) => this.setState({detail:text})}
                      placeholder={this.data.detail || '如有备注...'}
                      returnKeyType="default"
                    />
        </View>
        <Button
          style={styles.buttonText}
          containerStyle={styles.buttonAction}
          activeOpacity={0.5}
          onPress={()=>this._save()}>
          保存
        </Button>
      </ScrollView>
    );
  }
}
