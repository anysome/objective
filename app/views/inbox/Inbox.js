/**
 * Created by Layman(http://github.com/anysome) on 16/3/17.
 */
import React from 'react';
import {StyleSheet, RefreshControl, ListView,
  View, Text, LayoutAnimation, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import {analytics, airloy, styles, colors, api, toast, L, hang} from '../../app';
import util from '../../libs/Util';
import ListSource from '../../logic/ListSource';
import ListSectionView from '../../widgets/ListSectionView';
import ActionSheet from '../../widgets/ActionSheet';
import Edit from './Edit';
import Project from './Project';

export default class Inbox extends React.Component {

  constructor(props) {
    let {today, ...others} = props;
    super(props);
    this.listSource = null;
    this.projectList = null;
    this.today = today;
    this.state = {
      isRefreshing: true,
      dataSource: new ListView.DataSource({
        getSectionHeaderData: (dataBlob, sectionId) => dataBlob[sectionId],
        getRowData: (dataBlob, sectionId, rowId) => dataBlob[sectionId].getRow(rowId),
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      })
    };
    this.rightButtonIcon = null;
  }

  componentWillMount() {
    let route = this.props.navigator.navigationContext.currentRoute;
    this.rightButtonIcon = route.rightButtonIcon;
    route.onRightButtonPress = () => {
      let BUTTONS = ['新备忘', '新分类清单', '清空回收站', '取消'];
      let CANCEL_INDEX = 3, DESTRUCTIVE_INDEX = 2;
      ActionSheet.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          destructiveButtonIndex: DESTRUCTIVE_INDEX,
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
              this.props.navigator.push({
                title: '新增分类清单',
                component: Edit,
                passProps: {
                  sectionId: 1,
                  onUpdated: (rowData) => this.updateRow(rowData)
                }
              });
              break;
            case 2 :
              hang();
              let result = await airloy.net.httpGet(api.inbox.clean);
              if (result.success) {
                this.reload();
              } else {
                toast(L(result.message));
              }
              hang(false);
              break;
          }
        }
      );
    };
    util.isAndroid() ? this.props.navigator.replacePrevious(route) : this.props.navigator.replace(route);
  }

  componentDidMount() {
    analytics.onPageStart('page_inbox');
    this.reload();
  }

  componentWillUnMount() {
    analytics.onPageEnd('page_inbox');
  }

  async reload() {
    this.setState({
      isRefreshing: true
    });
    let result = await airloy.net.httpGet(api.inbox.list);
    if (result.success) {
      this.listSource = new ListSource(result.info);
      let result2 = await airloy.net.httpGet(api.project.list);
      if (result2.success) {
        this.listSource.concat(result2.info);
      } else {
        console.log('get project list error: ' + result2.message);
      }
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
    let section1 = new ListSectionView.DataSource({id: 1, name: '分类清单'});
    let section2 = new ListSectionView.DataSource({id: 2, name: '回收站'});
    for (let rowData of this.listSource) {
      this._sortRow(rowData, section0, section1, section2);
    }
    this.projectList = section1;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(
        [section0, section1, section2],
        [0, 1, 2],
        [section0.rowIds, section1.rowIds, section2.rowIds]
      )
    });
  }

  _sortRow(rowData, section0, section1, section2) {
    var section;
    if (typeof rowData.countTotal === "undefined") {
      if (rowData.arranged) return;
      if (rowData.catalog === 'trash') {
        section = section2;
      } else {
        section = section0;
      }
    } else {
      section = section1;
    }
    section.push(rowData);
  }

  _toProject(rowData) {
    this.props.navigator.push({
      title: '修改清单',
      component: Edit,
      rightButtonIcon: this.props.trashIcon,
      passProps: {
        data: rowData,
        sectionId: 1,
        onUpdated: (rowData) => this.updateRow(rowData),
        onDeleted: (rowData) => this.deleteRow(rowData)
      }
    });
  }

  _pressRow(rowData, sectionId) {
    if (sectionId === 1) {
      this.props.navigator.push({
        title: '分类清单',
        component: Project,
        rightButtonIcon: this.props.plusIcon,
        passProps: {
          data: rowData,
          nextIcon: this.props.trashIcon,
          onUpdated: (rowData) => this.updateRow(rowData)
        }
      });
    } else {
      this.props.navigator.push({
        title: '修改备忘',
        component: Edit,
        rightButtonIcon: this.rightButtonIcon,
        passProps: {
          data: rowData,
          projects: this.projectList,
          sectionId: sectionId,
          onUpdated: (rowData) => this.updateRow(rowData),
          onDeleted: (rowData) => this.deleteRow(rowData),
          onProjectized: (rowData) => this.updateProjects(rowData)
        }
      });
    }
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
          let newDate = moment(this.today + 86400000 * buttonIndex);
          let result = await airloy.net.httpGet(api.inbox.arrange, {
              id: rowData.id,
              adate: newDate.format('YYYY-MM-DD')
            }
          );
          hang(false);
          if (result.success) {
            airloy.event.emit('agenda.change');
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
    if (rowData.countTotal) {
      this.reload();
    } else {
      this._sortList();
    }
  }

  async updateProjects(rowData) {
    hang();
    this.listSource.remove(rowData);
    // reload project list to get newest info
    let result2 = await airloy.net.httpGet(api.project.list);
    if (result2.success) {
      this.listSource.concat(result2.info);
      this._sortList();
    } else {
      console.log('get project list error: ' + result2.message);
    }
    this.props.navigator.pop();
    hang(false);
  }

  _renderRow(rowData, sectionId, rowId) {
    if (sectionId === 1) {
      return (
        <TouchableOpacity style={style.container} onPress={() => this._pressRow(rowData, sectionId)}>
          <Icon size={28} name='ios-compose-outline' style={style.icon} color={colors.border}
                onPress={() => this._toProject(rowData)}/>
          <Text style={styles.title}>{rowData.title}</Text>
          <Text style={styles.hint}>{rowData.countTodo} / {rowData.countTotal}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={style.container} onPress={() => this._pressRow(rowData, sectionId)}>
          <Icon size={28} name='ios-calendar-outline' style={style.icon} color={colors.border}
                onPress={() => this._toArrange(rowData)}/>
          <View style={styles.flex}>
            <Text style={styles.title}>{rowData.title}</Text>
            <Text style={styles.text}>{rowData.detail}</Text>
          </View>
        </TouchableOpacity>
      );
    }
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
