/**
 * Created by Layman <anysome@gmail.com> (http://github.com/anysome) on 16/6/25.
 */
import React from 'react';
import {
  StyleSheet, ListView, RefreshControl,
  Image, View, Text, TouchableOpacity
} from 'react-native';
import {analytics, airloy, styles, colors, config, api, toast, L} from '../../app';
import util from '../../libs/Util';

import ActionSheet from '../../widgets/ActionSheet';
import EventTypes from '../../logic/EventTypes';
import TargetContentList from './TargetContentList';

export default class TargetList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
    this._renderRow = this._renderRow.bind(this);
  }

  componentDidMount() {
    this.reload();
  }

  async reload() {
    this.setState({
      isRefreshing: true
    });
    let result = await airloy.net.httpGet(api.discover.target.public);
    if (result.success) {
      this.setState({
        isRefreshing: false,
        dataSource: this.state.dataSource.cloneWithRows(result.info)
      });
    } else {
      result.message !== 'error.request.auth' && this.setState({
        isRefreshing: false
      });
      toast(L(result.message));
    }
  }

  _pressRow(rowData) {
    console.log('options show');
    ActionSheet.showActionSheetWithOptions({
        options: ['我也加入', '打卡记录', '取消'],
        cancelButtonIndex: 2,
        tintColor: colors.dark1
      },
      async(buttonIndex) => {
        switch (buttonIndex) {
          case 2:
            break;
          case 1:
            this.props.navigator.push({
              title: '打卡记录',
              component: TargetContentList,
              passProps: {
                data: rowData
              }
            });
            break;
          default:
            let result = await airloy.net.httpGet(api.discover.target.join, {
                id: rowData.id
              }
            );
            if (result.success) {
              airloy.event.emit(EventTypes.targetChange);
              toast('已经添加到检查单');
            } else {
              toast(L(result.message));
            }
            analytics.onEvent('click_target_join');
        }
      }
    );
  }

  _renderRow(rowData, sectionId, rowId, highlightRow) {
    return (
      <TouchableOpacity style={styles.section} onPress={() => this._pressRow(rowData)}>
        <Text style={style.title}>{rowData.title}</Text>
        <Text style={styles.text}>{rowData.summary}</Text>
        <View style={styles.sectionRow}>
          <Text style={style.hint}>
            参与: {rowData.participants}  打卡: {rowData.punches}
          </Text>
          <Text>
            由 {rowData.createUserName}(@{rowData.createUid}) 共享
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return <ListView enableEmptySections={true}
                     initialListSize={10}
                     pageSize={5}
                     dataSource={this.state.dataSource}
                     renderRow={this._renderRow}
                     refreshControl={<RefreshControl refreshing={this.state.isRefreshing}
                                                         onRefresh={() => this.reload()}
                                                         tintColor={colors.accent}
                                                         title="加载中..."
                                                         colors={['#ff0000', '#00ff00', '#0000ff']}
                                                         progressBackgroundColor="#EBEBEB" />}

    />;
  }
}

const style = StyleSheet.create({
  title: {
    marginTop: util.isAndroid() ? 6 : 0,
    marginBottom: util.isAndroid() ? 3 : 0,
    paddingTop: util.isAndroid() ? 0 : 10,
    paddingBottom: util.isAndroid() ? 0 : 10,
    color: colors.dark3,
    fontSize: 16
  },
  hint: {
    flex: 1,
    fontSize: 12,
    color: colors.border
  }
});
