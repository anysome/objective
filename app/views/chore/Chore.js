/**
 * Created by Layman <anysome@gmail.com> (http://github.com/anysome) on 16/8/20.
 */
import React from 'react';
import {StyleSheet, RefreshControl, ListView,
  View, Text, LayoutAnimation, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {analytics, airloy, styles, colors, api, toast, L, hang} from '../../app';
import util from '../../libs/Util';
import ListSource from '../../logic/ListSource';
import EventTypes from '../../logic/EventTypes';

import Controller from '../Controller';
import ListSectionView from '../../widgets/ListSectionView';
import ActionSheet from '../../widgets/ActionSheet';

import Edit from './Edit';
import Listing from './Listing';

export default class Chore extends Controller {

  constructor(props) {
    super(props);
    this.name = 'Chore';
    this.listSource = null;
    this.state = {
      isRefreshing: true,
      dataSource: new ListView.DataSource({
        getSectionHeaderData: (dataBlob, sectionId) => dataBlob[sectionId],
        getRowData: (dataBlob, sectionId, rowId) => dataBlob[sectionId].getRow(rowId),
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      })
    };
  }

  componentWillMount() {
    if (this.route) {// Logout and then login cause currentRoute to be null. Maybe a bug.
      this.route.rightButtonIcon = this.getIcon('ios-more-outline');
      this.route.onRightButtonPress = () => {
        let BUTTONS = ['新备忘', '清空回收站', '取消'];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: 2,
            destructiveButtonIndex: 1,
            tintColor: colors.dark1
          },
          async (buttonIndex) => {
            switch (buttonIndex) {
              case 0 :
                this.props.navigator.push({
                  title: '新增备忘',
                  component: Edit,
                  passProps: {
                    sectionId: 0,
                    onUpdated: (rowData) => this.updateRow(rowData)
                  }
                });
                break;
              case 1 :
                hang();
                let result = await airloy.net.httpGet(api.chore.clean);
                if (result.success) {
                  result.info && this.reload();
                } else {
                  toast(L(result.message));
                }
                hang(false);
                break;
            }
          }
        );
      };
      this.route.leftButtonIcon = this.getIcon('ios-list');
      this.route.onLeftButtonPress = () => {
        this.forward({
          title: '分类清单',
          component: Listing,
          rightButtonIcon: this.getIcon('ios-add'),
          passProps: {
            today: this.today,
            trashIcon: this.getIcon('ios-trash-outline'),
            plusIcon: this.getIcon('ios-add')
          }
        });
      };
      util.isAndroid() || this.props.navigator.replace(this.route);
    }
    airloy.event.on(EventTypes.choreChange, ()=> {
      // call network request or mark stale until page visible
      this.visible ? this.reload() : this.markStale();
    });
    airloy.event.on(EventTypes.choreAdd, (chore)=> {
      this.listSource.add(chore);
      this._sortList();
    });
  }

  async _reload() {
    this.setState({
      isRefreshing: true
    });
    let result = await airloy.net.httpGet(api.chore.list);
    if (result.success) {
      this.listSource = new ListSource(result.info);
      this._sortList();
      this.setState({
        isRefreshing: false
      });
    } else {
      result.message !== 'error.request.auth' && this.setState({
        isRefreshing: false
      });
      toast(L(result.message));
    }
  }

  _sortList() {
    let section0 = new ListSectionView.DataSource({id: 0, name: '收集箱'});
    let section1 = new ListSectionView.DataSource({id: 1, name: '回收站'});
    for (let rowData of this.listSource) {
      this._sortRow(rowData, section0, section1);
    }
    this.projectList = section1;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(
        [section0, section1],
        [0, 1],
        [section0.rowIds, section1.rowIds]
      )
    });
  }

  _sortRow(rowData, section0, section1) {
    var section;
    if (rowData.arranged) return;
    if (rowData.catalog === 'recycled') {
      section = section1;
    } else {
      section = section0;
    }
    section.push(rowData);
  }

  _pressRow(rowData, sectionId) {
    this.props.navigator.push({
      title: '修改备忘',
      component: Edit,
      rightButtonIcon: this.rightButtonIcon,
      passProps: {
        data: rowData,
        projects: this.projectList,
        sectionId: sectionId,
        onUpdated: (rowData) => this.updateRow(rowData),
        onDeleted: (rowData) => this.deleteRow(rowData)
      }
    });
  }

  _longPressRow(rowData) {
    let BUTTONS = ['删除', '取消'];
    ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        tintColor: colors.dark1
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          let isTrash = rowData.catalog === 'recycled';
          Alert.alert(
            '确认删除 ?',
            isTrash ? '彻底删除了哦, 清空回收站更快哒' : '删除后可在回收站里找到.',
            [
              {text: '不了'},
              {
                text: '删除',
                onPress: async () => {
                  hang();
                  let result2 = await airloy.net.httpGet(api.chore.remove, {id: rowData.id});
                  hang(false);
                  if (result2.success) {
                    if (isTrash) {
                      this.listSource.remove(rowData);
                      this._sortList();
                    } else {
                      rowData.catalog = 'recycled';
                      this.listSource.update(rowData);
                      this._sortList();
                    }
                  } else {
                    toast(L(result2.message));
                  }
                }
              }
            ]
          );
        }
      }
    );
  }

  _toArrange(rowData) {
    let BUTTONS = ['安排到今天', '安排到明天', '安排到后天', '取消'];
    let CANCEL_INDEX = 3;
    ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        tintColor: colors.dark1
      },
      async (buttonIndex) => {
        if (buttonIndex !== CANCEL_INDEX) {
          hang();
          let newDate = new Date(this.today + 86400000 * buttonIndex);
          let result = await airloy.net.httpGet(api.chore.arrange, {
              id: rowData.id,
              date: newDate
            }
          );
          hang(false);
          if (result.success) {
            airloy.event.emit(EventTypes.agendaAdd, result.info);
            this.listSource.remove(rowData);
            this._sortList();
          } else {
            toast(L(result.message));
          }
        }
      }
    );
  }

  updateRow(rowData) {
    // also for add
    this.listSource.update(rowData);
    this.props.navigator.pop();
    this._sortList();
  }

  deleteRow(rowData) {
    this.listSource.remove(rowData);
    this.props.navigator.pop();
    this._sortList();
  }

  _renderRow(rowData, sectionId, rowId) {
    return (
      <TouchableOpacity style={style.container} onPress={() => this._pressRow(rowData, sectionId)}
                        onLongPress={() => this._longPressRow(rowData)}>
        <Icon size={28} name='ios-calendar-outline' style={style.icon} color={colors.border}
              onPress={() => this._toArrange(rowData)}/>
        <View style={styles.flex}>
          <Text style={styles.title}>{rowData.title}</Text>
          {rowData.detail ? <Text style={styles.text}>{rowData.detail}</Text> : null}
        </View>
      </TouchableOpacity>
    );
  }

  _renderSectionHeader(sectionData, sectionId) {
    return <ListSectionView data={sectionData}/>;
  }

  _renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
    return <View key={rowId + '_separator'} style={styles.hr}></View>
  }

  render() {
    return (
      <ListView
        enableEmptySections={true}
        initialListSize={10}
        pageSize={5}
        dataSource={this.state.dataSource}
        renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, sectionId, rowId)}
        renderSectionHeader={this._renderSectionHeader}
        renderSeparator={this._renderSeparator}
        refreshControl={
                          <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this.reload()}
                            tintColor={colors.accent}
                            title={'加载中...'}
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#EBEBEB"
                          />}
      />
    );
  }
}



const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingRight: 16,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    backgroundColor: colors.light1
  },
  icon: {
    marginLeft: util.isAndroid() ? 16 : 0,
    paddingLeft: util.isAndroid() ? 0 : 16,
    marginRight: util.isAndroid() ? 10 : 0,
    paddingRight: util.isAndroid() ? 0 : 10
  }
});
