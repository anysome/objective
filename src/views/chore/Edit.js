/**
 * Created by Layman(http://github.com/anysome) on 16/3/17.
 */

import React from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity, Alert} from 'react-native';

import {analytics, styles, colors, airloy, api, L, toast, hang} from '../../app';
import util from '../../libs/Util';

import TextField from '../../widgets/TextField';
import TextArea from '../../widgets/TextArea';
import ActionSheet from '../../widgets/ActionSheet';

export default class Edit extends React.Component {

  constructor(props) {
    super(props);
    this._title = null;
    this.data = props.data || {title: ''};
    this.projects = [];
    this.state = {
      title: this.data.title,
      detail: this.data.detail
    };
  }

  componentWillMount() {
    let route = this.props.navigator.navigationContext.currentRoute;
    if (route.rightButtonIcon) {
      route.onRightButtonPress = () => this._showOptions();
      // so many bugs on android T_T
      util.isAndroid() ?
        this.props.navigator.replaceAtIndex(route, -1) :
        this.props.navigator.replace(route);
    }
  }

  _showOptions() {
    let BUTTONS = ['转入清单...', '做为新清单', '删除', '取消'];
    ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: 3,
        destructiveButtonIndex: 2,
        tintColor: colors.dark1
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0 :
            this._selectProjects();
            break;
          case 1 :
            hang();
            let result = await airloy.net.httpGet(api.chore.to.project, {id: this.data.id});
            hang(false);
            if (result.success) {
              this.props.onDeleted(this.data);
            } else {
              toast(L(result.message));
            }
            break;
          case 2 :
            let isTrash = this.data.catalog === 'recycled';
            hang();
            let result2 = await airloy.net.httpGet(api.chore.remove, {id: this.data.id});
            hang(false);
            if (result2.success) {
              if (isTrash) {
                this.props.onDeleted(this.data);
              } else {
                this.data.catalog = 'trash';
                this.props.onUpdated(this.data);
              }
            } else {
              toast(L(result2.message));
            }
            break;
        }
      }
    );
  }

  async _selectProjects() {
    let BUTTONS = [];
    if ( this.projects.length === 0) {
      let result = await airloy.net.httpGet(api.project.list.focus);
      if (result.success) {
        this.projects = result.info;
      } else {
        toast(L(result.message));
        return;
      }
    }
    for (let project of this.projects) {
      BUTTONS.push(project.title);
    }
    BUTTONS.push('取消');
    let CANCEL_INDEX = this.projects.length;
    ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        tintColor: colors.dark1
      },
      async (buttonIndex) => {
        if (buttonIndex !== CANCEL_INDEX) {
          hang();
          let result = await airloy.net.httpGet(api.chore.to.task, {
            id: this.data.id,
            projectId: this.projects[buttonIndex].id
          });
          hang(false);
          if (result.success) {
            this.props.onDeleted(this.data);
          } else {
            toast(L(result.message));
          }
        }
      }
    );
  }

  async _save() {
    let result;
    this.data.detail = this.state.detail;
    if (this.data.id) {
      if (this._title.value.length > 0) {
        this.data.title = this.state.title;
      }
      hang();
      result = await airloy.net.httpPost(api.chore.update, this.data);
    } else {
      if (this._title.value.length < 1) {
        this._title.focus();
        return;
      }
      this.data.title = this.state.title;
      hang();
      result = await airloy.net.httpPost(api.chore.add, this.data);
    }
    hang(false);
    if (result.success) {
      this.props.onUpdated(result.info);
    } else {
      toast(L(result.message));
    }
    analytics.onEvent('click_inbox_save');
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
            placeholder={this.data.title || '先记下来...'}
            returnKeyType="done"
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
        <TouchableOpacity style={styles.row} onPress={()=> this._save()}>
          <Text style={styles.link}>保存</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
