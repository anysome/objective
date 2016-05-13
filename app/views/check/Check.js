/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
import React from 'react';
import {
  StyleSheet, View, ScrollView, ListView, Platform,
  RefreshControl, TouchableOpacity, Text
} from 'react-native';

import {analytics, airloy, styles, colors, api, L, toast} from '../../app';
import util from '../../libs/Util';
import ListSource from '../../logic/ListSource';
import EventTypes from '../../logic/EventTypes';

import Controller from '../Controller';
import ListSectionView from '../../widgets/ListSectionView';
import ActionSheet from '../../widgets/ActionSheet';
import ListRow from './ListRow';
import Glance from './Glance';
import Edit from './Edit';


export default class Check extends Controller {

  constructor(props) {
    super(props);
    this.name = 'Check';
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
      this.route.rightButtonIcon = this.getIcon('ios-plus-empty');
      this.props.navigator.replace(this.route);
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
    }
    airloy.event.on(EventTypes.targetChange, () => {
      this.visible ? this.reload() : this.markStale();
    });
    airloy.event.on(EventTypes.targetPunch, (done) => {
      let rowData = this.listSource.read(done.id);
      if (rowData) {
        rowData.closed = true;
        rowData.times = done.times;
        this.listSource.update(rowData);
        this._sortList();
      }
    });
  }

  async _reload() {
    this.setState({
      isRefreshing: true
    });
    let result = await airloy.net.httpGet(api.check.list, null);
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

  _sortRow(checkDaily, section0, section1, section2) {
    if (checkDaily.closed) {
      section2.push(checkDaily);
    } else {
      if (checkDaily.arranged) {
        section1.push(checkDaily);
      } else {
        section0.push(checkDaily);
      }
    }
  }

  _pressRow(rowData, sectionId) {
    if (sectionId === 0) {
      let BUTTONS = ['安排到今天'];
      let CANCEL_INDEX = 2, DESTRUCTIVE_INDEX = 1;
      let ms = rowData.endDate - this.today;
      if (ms > 0) {
        BUTTONS.push('安排到明天');
        CANCEL_INDEX = 3, DESTRUCTIVE_INDEX = 2;
      }
      if (ms > 86400000) {
        BUTTONS.push('安排到后天');
        CANCEL_INDEX = 4, DESTRUCTIVE_INDEX = 3;
      }
      BUTTONS.push('查看', '取消');

      ActionSheet.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          destructiveButtonIndex: DESTRUCTIVE_INDEX,
          tintColor: colors.dark1
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
                  today: this.today,
                  nextIcon: this.getIcon('ios-trash-outline')
                }
              });
              break;
            default:
              let result = await airloy.net.httpGet(api.check.arrange, {
                  id: rowData.id,
                  defer: buttonIndex
                }
              );
              if (result.success) {
                airloy.event.emit('agenda.change');
                rowData.arranged = true;
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
          today: this.today,
          nextIcon: this.getIcon('ios-trash-outline')
        }
      });
    }
  }

  _renderRow(rowData, sectionId, rowId) {
    return <ListRow data={rowData} sectionId={sectionId} today={this.today}
                    onPress={() => this._pressRow(rowData, sectionId)}/>;
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
  }

  render() {
    console.log(' render check page');
    return (
      <View style={styles.flex}>
        <ListView enableEmptySections={true}
                  initialListSize={10} pageSize={5}
                  dataSource={this.state.dataSource}
                  renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, sectionId, rowId)}
                  renderSectionHeader={this._renderSectionHeader}
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
          <View style={[style.line, {borderTopWidth:1, borderTopColor:colors.light2}]}>
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
    backgroundColor: colors.light1,
    borderBottomWidth: 1,
    borderBottomColor: colors.light3
  },
  line: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  cell: {
    flex: 1,
    color: colors.accent,
    fontSize: 16,
    textAlign: 'center'
  }
});
