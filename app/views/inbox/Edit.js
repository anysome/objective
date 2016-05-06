/**
 * Created by Layman(http://github.com/anysome) on 16/3/17.
 */

import React from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity, Alert} from 'react-native';
import moment from 'moment';
import {analytics, styles, colors, airloy, api, L, toast, hang} from '../../app';
import util from '../../libs/Util';
import TextField from '../../widgets/TextField';
import TextArea from '../../widgets/TextArea';
import ActionSheet from '../../widgets/ActionSheet';

export default class Edit extends React.Component {

  constructor(props) {
    var {data, sectionId, ...others} = props;
    super(others);
    this._title = null;
    this.data = data || {title: '', detail: ''};
    this.state = {
      title: this.data.title,
      detail: this.data.detail
    };
  }

  componentWillMount() {
    let route = this.props.navigator.navigationContext.currentRoute;
    if (route.rightButtonIcon) {
      if (this.props.sectionId === 1) {
        // edit project
        route.onRightButtonPress = () => {
          Alert.alert(
            '确认删除 ?',
            this.data.countTodo > 0 ? '未完成的任务可在回收站里找到.' : '彻底删除了哦!',
            [
              {text: '不了'},
              {
                text: '删除',
                onPress: async () => {
                  hang();
                  let result = await airloy.net.httpGet(api.project.remove, {id: this.data.id});
                  if (result.success) {
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
      } else {
        // edit chore
        route.onRightButtonPress = () => this._showOptions();
      }
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
            let result = await airloy.net.httpGet(api.project.plot, {id: this.data.id});
            if (result.success) {
              this.props.onProjectized(this.data);
            } else {
              toast(L(result.message));
            }
            hang(false);
            break;
          case 2 :
            let isTrash = this.data.catalog === 'trash';
            Alert.alert(
              '确认删除 ?',
              isTrash ? '彻底删除了哦, 清空回收站更快哒' : '删除后可在回收站里找到.',
              [
                {text: '不了'},
                {
                  text: '删除',
                  onPress: async () => {
                    hang();
                    let result2 = await airloy.net.httpGet(api.inbox.remove, {id: this.data.id});
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
                  }
                }
              ]
            );
            break;
        }
      }
    );
  }

  _selectProjects() {
    let BUTTONS = [], projects = [];
    for (let project of this.props.projects) {
      projects.push(project);
      BUTTONS.push(project.title);
    }
    ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        tintColor: colors.dark1
      },
      async (buttonIndex) => {
        hang();
        let result = await airloy.net.httpGet(api.project.move, {
          id: this.data.id,
          topicId: projects[buttonIndex].id
        });
        if (result.success) {
          this.props.onProjectized(this.data);
        } else {
          toast(L(result.message));
        }
        hang(false);
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
      let url = this.props.sectionId === 1 ? api.project.update : api.inbox.update;
      hang();
      result = await airloy.net.httpPost(url, this.data);
    } else {
      if (this._title.value.length < 1) {
        this._title.focus();
        return;
      }
      this.data.title = this.state.title;
      let url = this.props.sectionId === 1 ? api.project.add : api.inbox.add;
      hang();
      result = await airloy.net.httpPost(url, this.data);
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
            value={this.state.title}
            onChangeText={(text) => this.setState({title:text})}
            placeholder={this.data.title || '想做什么...'}
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

const style = StyleSheet.create({
  text: {
    paddingTop: 5,
    paddingBottom: 5,
    color: colors.dark1,
    fontSize: 14
  }
});
