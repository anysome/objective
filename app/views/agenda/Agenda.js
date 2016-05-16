/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
import React from 'react';
import {View, ListView, RefreshControl, Alert} from 'react-native';
import moment from 'moment';

import {analytics, airloy, styles, colors, api, L, toast, hang} from '../../app';
import util from '../../libs/Util';
import ListSource from '../../logic/ListSource';
import LocalNotifications from '../../logic/LocalNotifications';
import EventTypes from '../../logic/EventTypes';

import Controller from '../Controller';
import ListSectionView from '../../widgets/ListSectionView';
import ActionSheet from '../../widgets/ActionSheet';
import ListRow from './ListRow';
import Edit from './Edit';
import Commit from './Commit';
import Inbox from './../inbox/Inbox';
import Timer from './Timer';


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
      this.route.leftButtonIcon = this.getIcon('ios-box-outline');
      this.route.onLeftButtonPress = () => {
        this.forward({
          title: '待定',
          component: Inbox,
          rightButtonIcon: this.getIcon('ios-more-outline'),
          passProps: {
            today: this.today,
            trashIcon: this.getIcon('ios-trash-outline'),
            plusIcon: this.getIcon('ios-plus-empty')
          }
        });
      };
      this.route.rightButtonIcon = this.getIcon('ios-compose-outline');
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
      this.props.navigator.replace(this.route);
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
    let result = await airloy.net.httpGet(api.agenda.list, null);
    if (result.success) {
      this.listSource = new ListSource(result.info);
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
                    onIconClick={() => this._pressRowIcon(rowData, sectionId)}
                    onLongPress={() => this._longPressRow(rowData, sectionId)}/>;
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
        rightButtonIcon: this.getIcon('ios-more-outline'),
        passProps: {
          today: this.today,
          data: rowData,
          onFeedback: (agenda) => this.updateRow(agenda),
          onDelete: (agenda) => this.deleteRow(agenda)
        }
      });
    }
  }

  async _pressRowIcon(rowData, sectionId) {
    if (sectionId === 2) {
      this._pressRow(rowData);
    } else {
      if (sectionId === 1) {
        let result = await airloy.net.httpGet(api.agenda.schedule, {
          id: rowData.id,
          newDate: moment(this.today).format('YYYY-MM-DD')
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

  _longPressRow(rowData, sectionId) {
    if (sectionId !== 2) {
      let isToday = sectionId === 0;
      let BUTTONS = isToday ? ['删除', '定时提醒', '推迟到明天', '取消'] : ['删除', '定时提醒', '取消'];
      ActionSheet.showActionSheetWithOptions({
          options: BUTTONS,
          destructiveButtonIndex: 0,
          cancelButtonIndex: isToday ? 3 : 2,
          tintColor: colors.dark1
        },
        async (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
                  let message = rowData.checkDailyId ? '删除后可重新安排检查单.' : '删除后可在待定列表的回收站里找到.'
                  Alert.alert(
                    '确认删除 ?',
                    message,
                    [
                      {text: '不了'},
                      {
                        text: '删除',
                        onPress: async () => {
                          hang();
                          let result = await airloy.net.httpGet(api.agenda.remove, {id: rowData.id});
                          if (result.success) {
                            airloy.event.emit('target.change');
                            this.deleteRow(rowData);
                          } else {
                            toast(L(result.message));
                          }
                          hang(false);
                        }
                      }
                    ]
                  );
                  break;
            case 1:
                  this.setState({
                    showTimer: true,
                    selectedRow: rowData
                  });
                  break;
            case 2:
                  if (isToday) {
                    hang();
                    let newDate = moment(this.today + 86400000);
                    let result = await airloy.net.httpGet(api.agenda.schedule, {
                        id: rowData.id,
                        newDate: newDate.format('YYYY-MM-DD')
                      }
                    );
                    hang(false);
                    if (result.success) {
                      rowData.today = this.today + 86400000;
                      this._updateData(util.clone(rowData));
                    } else {
                      toast(L(result.message));
                    }
                    analytics.onEvent('click_agenda_schedule');
                  }
                  break;
            default :
                  console.log('cancel options');
          }
        }
      );
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
    LocalNotifications.cancelAgenda(rowData.id);
    this.listSource.remove(rowData);
    this._sortList();
    this.backward();
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

  render() {
    console.log(' render agenda page');
    return (
      <View style={styles.flex}>
        <ListView
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
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#EBEBEB"
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
