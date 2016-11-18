/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
import React from 'react';
import {
  StyleSheet, View, ScrollView, ListView,
  RefreshControl, TouchableOpacity, Text, Alert
} from 'react-native';

import {analytics, airloy, styles, colors, px1, api, L, toast, hang} from '../../app';
import util from '../../libs/Util';
import ListSource from '../../logic/ListSource';
import EventTypes from '../../logic/EventTypes';

import Controller from '../Controller';
import ListSectionView from '../../widgets/ListSectionView';
import ActionSheet from '../../widgets/ActionSheet';
import ListRow from './ListRow';
import Glance from './Glance';
import Edit from './Edit';
import HistoryTarget from './HistoryTarget';

export default class Target extends Controller {

  constructor(props) {
    super(props);
    this.name = 'Target';
    this.listSource = null;
    this.state = {
      isRefreshing: true,
      panelTop: util.isAndroid() ? -100 : -36,
      dataSource: new ListView.DataSource({
        getSectionHeaderData: (dataBlob, sectionId) => dataBlob[sectionId],
        getRowData: (dataBlob, sectionId, rowId) => dataBlob[sectionId].getRow(rowId),
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      })
    };
  }

  componentWillMount() {
    if (this.route) {
      this.route.rightButtonIcon = require('../../../resources/icons/create.png');
      this.route.onRightButtonPress = () => {
        let newTop = -100;
        if (util.isAndroid()) {
          newTop = this.state.panelTop === 0 ? -100 : 0
        } else {
          newTop = this.state.panelTop === 65 ? -36 : 65
        }
        this.setState({
          panelTop: newTop
        });
        analytics.onEvent('click_check_add');
      };
      this.route.leftButtonIcon = require('../../../resources/icons/archive.png');
      this.route.onLeftButtonPress = () => {
        this.forward({
          title: '过期目标',
          component: HistoryTarget,
          passProps: {
            today: this.today
          }
        });
      };
      util.isAndroid() || this.props.navigator.replace(this.route);
    }
    airloy.event.on(EventTypes.targetChange, () => {
      this.visible ? this.reload() : this.markStale();
    });
    airloy.event.on(EventTypes.targetPunch, (done) => {
      let rowData = this.listSource.read(done.id);
      if (rowData) {
        rowData.doneAmount = done.amonut;
        rowData.doneTotal = rowData.doneTotal + done.amonut;
        if (rowData.roundDateEnd == done.roundDateEnd) {
          rowData.roundTotal = rowData.roundTotal + done.amonut;
        }
        this.listSource.update(rowData);
        this._sortList();
      }
    });
  }

  async _reload() {
    this.setState({
      isRefreshing: true
    });
    let result = await airloy.net.httpGet(api.target.list.focus);
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
    let section0 = new ListSectionView.DataSource({id: 0, name: '未安排'});
    let section1 = new ListSectionView.DataSource({id: 1, name: '已安排'});
    let section2 = new ListSectionView.DataSource({id: 2, name: '已打卡'});
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

  _sortRow(target, section0, section1, section2) {
    if (target.arranged) {
      if (target.doneAmount) {
        section2.push(target);
      } else {
        section1.push(target);
      }
    } else {
      section0.push(target);
    }
  }

  _pressRow(rowData, sectionId) {
    if (sectionId === 0) {
      let BUTTONS = [];
      let CANCEL_INDEX = 1, DESTRUCTIVE_INDEX = 0;
      let ms = rowData.roundDateEnd - this.today;
      if (ms > -1) {
        BUTTONS.push('安排到今天');
        CANCEL_INDEX = 2, DESTRUCTIVE_INDEX = 1;
      }
      if (ms > 0) {
        BUTTONS.push('安排到明天');
        CANCEL_INDEX = 3, DESTRUCTIVE_INDEX = 2;
      }
      if (ms > 86400000) {
        BUTTONS.push('安排到后天');
        CANCEL_INDEX = 4, DESTRUCTIVE_INDEX = 3;
      }
      BUTTONS.push('完成情况', '取消');

      ActionSheet.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          tintColor: colors.dark2
        },
        async(buttonIndex) => {
          switch (buttonIndex) {
            case CANCEL_INDEX:
              break;
            case DESTRUCTIVE_INDEX:
              this.forward({
                title: '完成情况',
                component: Glance,
                passProps: {
                  data: rowData,
                  today: this.today
                }
              });
              break;
            default:
              let result = await airloy.net.httpGet(api.target.arrange, {
                  id: rowData.id,
                  date: new Date(this.today + buttonIndex * 86400000)
                }
              );
              if (result.success) {
                airloy.event.emit(EventTypes.agendaAdd, result.info);
                rowData.arranged = true;
                rowData.doneAmount = 0;
                this.listSource.update(rowData);
                this._sortList();
              } else {
                toast(L(result.message));
              }
              analytics.onEvent('click_check_arrange');
          }
        }
      );
    } else {
      this.forward({
        title: '完成情况',
        component: Glance,
        passProps: {
          data: rowData,
          today: this.today
        }
      });
    }
  }

  _longPressRow(rowData, sectionId) {
    ActionSheet.showActionSheetWithOptions({
        options: ['修改', '删除', '取消'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
        tintColor: colors.dark2
      },
      async(buttonIndex) => {
        switch (buttonIndex) {
          case 2:
            break;
          case 1:
            this._toDelete(rowData);
            break;
          default:
            if ( result.success ) {
              this.forward({
                title: '修改',
                component: Edit,
                rightButtonIcon: require('../../../resources/icons/more.png'),
                passProps: {
                  data: rowData
                }
              });
            } else {
              toast(L(result.message));
            }
        }
      }
    );
  }

  _toDelete(rowData) {
    Alert.alert(
      '确认删除 ?',
      '将彻底删除该目标和它所有产生的待办.',
      [
        {text: '不了'},
        {
          text: '删除',
          onPress: async () => {
            hang();
            let result = await airloy.net.httpGet(api.target.remove, {id: rowData.id});
            if (result.success) {
              airloy.event.emit(EventTypes.agendaChange);
              this.listSource.remove(rowData);
              this._sortList();
            } else {
              toast(L(result.message));
            }
            hang(false);
          }
        }
      ]
    );
  }

  _renderRow(rowData, sectionId, rowId) {
    return <ListRow data={rowData} sectionId={sectionId} today={this.today}
                    onPress={() => this._pressRow(rowData, sectionId)}
                    onLongPress={() => this._longPressRow(rowData, sectionId)}/>;
  }

  _renderSectionHeader(sectionData, sectionId) {
    return <ListSectionView data={sectionData}/>;
  }

  _toAdd(type) {
    this.forward({
      title: '添加',
      component: Edit,
      passProps: {
        type: type
      }
    });
    let newTop = -100;
    if (util.isAndroid()) {
      newTop = this.state.panelTop === 0 ? -100 : 0
    } else {
      newTop = this.state.panelTop === 65 ? -36 : 65
    }
    this.setState({
      panelTop: newTop
    });
  }

  render() {
    return (
      <View style={styles.flex}>
        <ListView enableEmptySections={true}
                  initialListSize={10}
                  pageSize={5}
                  dataSource={this.state.dataSource}
                  renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, sectionId, rowId)}
                  renderSectionHeader={this._renderSectionHeader}
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
        <View style={[style.panel, {top: this.state.panelTop}]}>
          <View style={style.line}>
            <TouchableOpacity onPress={()=> this._toAdd('1')}>
              <Text style={style.cell}>每日习惯</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this._toAdd('2')}>
              <Text style={style.cell}>月份指标</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this._toAdd('3')}>
              <Text style={style.cell}>年度目标</Text>
            </TouchableOpacity>
          </View>
          <View style={[style.line, {borderTopWidth: px1, borderTopColor:colors.bright2}]}>
            <TouchableOpacity onPress={()=> this._toAdd('4')}>
              <Text style={style.cell}>百次行动</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this._toAdd('5')}>
              <Text style={style.cell}>番茄时间</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this._toAdd('6')}>
              <Text style={style.cell}>个性定制</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: util.isAndroid() ? -100 : -36,
    left: 0,
    right: 0,
    height: 100,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: colors.bright1,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  line: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  cell: {
    color: colors.accent,
    fontSize: 16
  }
});
