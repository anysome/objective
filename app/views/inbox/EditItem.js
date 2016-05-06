/**
 * Created by Layman(http://github.com/anysome) on 16/3/19.
 */

import React from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity, Alert} from 'react-native';
import moment from 'moment';

import {analytics, styles, colors, airloy, api, L, toast, hang} from '../../app';
import util from '../../libs/Util';
import TextField from '../../widgets/TextField';
import TextArea from '../../widgets/TextArea';

export default class EditItem extends React.Component {

  constructor(props) {
    var {data, sectionId, ...others} = props;
    super(others);
    this._title = null;
    this.data = data || {title: '', detail: '', arranged: false};
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
          '删除后可在回收站里找到.',
          [
            {text: '不了'},
            {
              text: '删除',
              onPress: async () => {
                hang();
                let result = await airloy.net.httpGet(api.project.item.remove, {id: this.data.itemId});
                hang(false);
                if (result.success) {
                  this.props.onDeleted(this.data);
                } else {
                  toast(L(result.message));
                }
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
    if (this.props.projectId) {
      if (this._title.value.length < 1) {
        this._title.focus();
        return;
      }
      let item = {
        topicId: this.props.projectId,
        title: this.state.title,
        detail: this.state.detail
      };
      hang();
      result = await airloy.net.httpPost(api.project.item.add, item);
    } else {
      let chore = {
        id: this.data.choreId,
        title: this.data.title,
        detail: this.state.detail
      };
      if (this._title.value.length > 0) {
        chore.title = this.state.title;
      }
      hang();
      result = await airloy.net.httpPost(api.inbox.update, chore);
    }
    if (result.success) {
      this.data.arranged && airloy.event.emit('agenda.change');
      this.props.onUpdated(result.info);
    } else {
      toast(L(result.message));
    }
    hang(false);
    analytics.onEvent('click_task_save');
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
        { this.props.editable &&
        <TouchableOpacity style={styles.row} onPress={()=> this._save()}>
          <Text style={styles.link}>保存</Text>
        </TouchableOpacity>
        }
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
