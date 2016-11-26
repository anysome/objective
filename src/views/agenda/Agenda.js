/**
 * Created by Layman(http://github.com/anysome) on 16/11/26.
 */
import React from 'react';
import {View, RefreshControl, StyleSheet} from 'react-native';
import moment from 'moment';

import SwipeableListViewDataSource from 'SwipeableListViewDataSource';
import SwipeableListView from 'SwipeableListView';
import SwipeableQuickActions from 'SwipeableQuickActions';
import SwipeableQuickActionButton from 'SwipeableQuickActionButton';

import {analytics, airloy, styles, colors, api, L, toast, hang} from '../../app';
import util from '../../libs/Util';
import ListSource from '../../logic/ListSource';
import LocalNotifications from '../../logic/LocalNotifications';
import EventTypes from '../../logic/EventTypes';

import Controller from '../Controller';
import ListSectionView from '../../widgets/ListSectionView';
import ActionSheet from '@yfuks/react-native-action-sheet';
import ListRow from './ListRow';
import Edit from './Edit';
import Commit from './Commit';
import Timer from './Timer';
import Dones from './Dones';


export default class Agenda extends Controller {

  constructor(props) {
    super(props);
    this.name = 'Agenda';
    this.listSource = null;
    this.state = {
      isRefreshing: true,
      showCommit: false,
      showTimer: false,
      selectedRow: {},
      dataSource: new SwipeableListViewDataSource({
        getSectionHeaderData: (dataBlob, sectionId) => dataBlob[sectionId],
        getRowData: (dataBlob, sectionId, rowId) => dataBlob[sectionId].getRow(rowId),
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      })
    };
  }

  componentWillMount() {
    if (this.route) {// Logout and then login cause currentRoute to be null. Maybe a bug.
      this.route.leftButtonIcon = require('../../../resources/icons/dones.png');
      this.route.onLeftButtonPress = () => {
        this.forward({
          title: '近期完成',
          component: Dones
        });
      };
      this.route.rightButtonIcon = require('../../../resources/icons/create.png');
      this.route.onRightButtonPress = () => {
        this.forward({
          title: '添加',
          component: Edit,
          passProps: {
            today: this.today,
            onFeedback: (agenda) => this.addRow(agenda)
          }
        });
      };
      util.isAndroid() || this.props.navigator.replace(this.route);
    }
    airloy.event.on(EventTypes.agendaChange, ()=> {
      // call network request or mark stale until page visible
      this.visible ? this.reload() : this.markStale();
    });
    airloy.event.on(EventTypes.agendaAdd, (agenda)=> {
      this.listSource.add(agenda);
      this._sortList();
    });
  }

  addRow(rowData) {
    this.listSource.add(rowData);
    this._sortList();
    this.backward();
  }

  async _reload() {
    this.setState({
      isRefreshing: true
    });
    let result = await airloy.net.httpGet(api.agenda.list.focus);
    if (result.success) {
      this.listSource = new ListSource(result.info, (agenda) => {
        // check each item and schedule reminder if necessary
        agenda.reminder && LocalNotifications.scheduleAgenda(agenda);
      });
      this._sortList();
      this.setState({
        isRefreshing: false
      });
    } else {
      // event emit will unmount this component
      result.message !== 'error.request.auth' && this.setState({
        isRefreshing: false
      });
      toast(L(result.message));
    }
  }

  _sortList() {
    let section0 = new ListSectionView.DataSource({id: 0, name: moment(this.today).format('D日（ddd）')});
    let section1 = new ListSectionView.DataSource({id: 1, name: '计划内'});
    let section2 = new ListSectionView.DataSource({id: 2, name: '今日完成'});
    for (let rowData of this.listSource) {
      this._sortRow(rowData, section0, section1, section2);
    }
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(
        [section0, section1, section2],
        [0, 1, 2],
        [section0.rowIds, section1.rowIds, section2.rowIds]
      )
    });
  }

  _sortRow(agenda, section0, section1, section2) {
    var section;
    if (agenda.status === '1') {
      section = section2;
    } else {
      if (agenda.today > this.today) {
        section = section1;
      } else {
        section = section0;
      }
    }
    section.push(agenda);
  }

  _renderRow(rowData, sectionId, rowId) {
    return <ListRow data={rowData} sectionId={sectionId} today={this.today}
                    onPress={() => this._pressRow(rowData)}
                    onIconClick={() => this._pressRowIcon(rowData, sectionId)}/>;
  }

  _pressRow(rowData) {
    if (rowData.status === '1') {
      this.forward({
        title: '查看',
        component: Edit,
        passProps: {
          today: this.today,
          data: rowData
        }
      });
    } else {
      this.forward({
        title: '修改',
        component: Edit,
        passProps: {
          today: this.today,
          data: rowData,
          onFeedback: (agenda) => this.updateRow(agenda)
        }
      });
    }
  }

  async _pressRowIcon(rowData, sectionId) {
    if (sectionId === 2) {
      this._pressRow(rowData);
    } else {
      if (sectionId === 1) {
        let result = await airloy.net.httpPost(api.agenda.update, {
          id: rowData.id,
          today: new Date(this.today)
        });
        if (result.success) {
          rowData.today = this.today;
          this.updateRow(rowData);
        } else {
          toast(L(result.message));
        }
        analytics.onEvent('click_agenda_schedule');
      } else {
        this.setState({
          showCommit: true,
          selectedRow: rowData
        });
      }
    }
  }

  updateRow(rowData) {
    this._updateData(rowData);
    this.backward();
  }

  _updateData(rowData) {
    // add or remove notification
    LocalNotifications.scheduleAgenda(rowData);
    this.listSource.update(rowData);
    this._sortList();
  }

  deleteRow(rowData) {
    rowData.reminder && LocalNotifications.cancelAgenda(rowData.id);
    this.listSource.remove(rowData);
    this._sortList();
  }

  commitRow(rowData) {
    if (rowData) {
      this.listSource.update(rowData);
      this._sortList();
    }
    this.setState({
      showCommit: false
    });
  }

  updateTimer(rowData) {
    if (rowData) {
      this._updateData(util.clone(rowData));
    }
    this.setState({
      showTimer: false
    });
  }

  _renderSectionHeader(sectionData, sectionId) {
    return <ListSectionView data={sectionData}/>;
  }

  _renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
    return <View key={rowId + '_separator'} style={styles.hr}></View>
  }

  _renderActions(rowData, sectionId) {
    return (
      <SwipeableQuickActions style={styles.rowActions}>
        { sectionId !== 2 &&
        <SwipeableQuickActionButton imageSource={{}} text={"更多"}
                                    onPress={() => this._moreActions(rowData, sectionId)}
                                    style={styles.rowAction} textStyle={styles.rowText}/>
        }
        <SwipeableQuickActionButton imageSource={{}} text={"删除"}
                                    onPress={() => this._delete(rowData)}
                                    style={styles.rowActionDestructive} textStyle={styles.rowText}/>
      </SwipeableQuickActions>
    );
  }

  _moreActions(rowData, sectionId) {
    let isToday = sectionId === 0;
    let scheduleOption = isToday ? '推迟到明天' : '提前到今天';
    let priorityOption = rowData.priority === 9 ? '没那么重要' : '当日第一优先';
    let BUTTONS = ['提醒', scheduleOption, priorityOption, '取消'];
    ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: 3,
        tintColor: colors.dark2
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            this.setState({
              showTimer: true,
              selectedRow: rowData
            });
            this.state.dataSource.setOpenRowID(null);
            break;
          case 1:
            let newDate;
            if (isToday) {
              newDate = new Date(this.today + 86400000);
            } else {
              newDate = new Date(this.today);
            }
            hang();
            let result = await airloy.net.httpPost(api.agenda.update, {
                id: rowData.id,
                today: newDate
              }
            );
            hang(false);
            if (result.success) {
              this._updateData(result.info);
            } else {
              toast(L(result.message));
            }
            analytics.onEvent('click_agenda_schedule');
            break;
          case 2:
            hang();
            let result2 = await airloy.net.httpPost(api.agenda.update, {
                id: rowData.id,
                priority: rowData.priority === 9 ? 1 : 9
              }
            );
            hang(false);
            if (result2.success) {
              this.state.dataSource.setOpenRowID(null);
              this._updateData(result2.info);
            } else {
              toast(L(result2.message));
            }
            analytics.onEvent('click_agenda_priority');
            break;
          default :
            console.log('cancel options');
        }
      }
    );
  }

  async _delete(rowData) {
    hang();
    let result = await airloy.net.httpGet(api.agenda.remove, {id: rowData.id});
    hang(false);
    if (result.success) {
      if (rowData.targetId) {
        airloy.event.emit(EventTypes.targetChange);
      } else if (rowData.projectId) {
        airloy.event.emit(EventTypes.taskChange);
      } else {
        airloy.event.emit(EventTypes.choreChange);
      }
      rowData.reminder && LocalNotifications.cancelAgenda(rowData.id);
      this.listSource.remove(rowData);
      this._sortList();
    } else {
      toast(L(result.message));
    }
  }

  render() {
    return (
      <View style={styles.flex}>
        <SwipeableListView
          maxSwipeDistance={120}
          renderQuickActions={(rowData, sectionId, rowId) => this._renderActions(rowData, sectionId)}
          enableEmptySections={true}
          initialListSize={10}
          pageSize={10}
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
                            colors={[colors.accent, colors.action]}
                            progressBackgroundColor={colors.bright1}
                          />}
        />
        <Commit data={this.state.selectedRow} visible={this.state.showCommit}
                onFeedback={(agenda) => this.commitRow(agenda)}/>
        <Timer data={this.state.selectedRow} visible={this.state.showTimer}
               onFeedback={(agenda) => this.updateTimer(agenda)}/>
      </View>

    );
  }
}
