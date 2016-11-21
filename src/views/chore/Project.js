/**
 * Created by Layman(http://github.com/anysome) on 16/3/17.
 */

import React from 'react';
import {StyleSheet, ListView, RefreshControl, View, Text,
  TouchableOpacity, Image, InteractionManager} from 'react-native';

import {analytics, styles, colors, px1, airloy, api, toast, L, hang} from '../../app';
import util from '../../libs/Util';
import ListSource from '../../logic/ListSource';
import ActionSheet from '../../widgets/ActionSheet';
import EventTypes from '../../logic/EventTypes';

import EditTask from './EditTask';

export default class Project extends React.Component {

  constructor(props) {
    super(props);
    this.listSource = new ListSource();
    this.project = props.data;
    this.today = props.today;
    this.countChanged = false;
    this.state = {
      isRefreshing: true,
      dataSource: new ListView.DataSource({
        getSectionHeaderData: (dataBlob, sectionId) => this.project,
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      })
    };
  }

  componentWillMount() {
    let route = this.props.navigator.navigationContext.currentRoute;
    route.onRightButtonPress = () => {
      this.props.navigator.push({
        title: '添加子任务',
        component: EditTask,
        passProps: {
          projectId: this.project.id,
          editable: true,
          onUpdated: (rowData) => this.updateRow(rowData)
        }
      });
    };
    // so many bugs on android T_T
    util.isAndroid() ?
      this.props.navigator.replaceAtIndex(route, -1) : this.props.navigator.replace(route);
    airloy.event.on(EventTypes.taskChange, ()=> {
      this.reload();
    });
  }

  componentDidMount() {
    analytics.onPageStart('page_project');
    util.isAndroid() ? InteractionManager.runAfterInteractions(() => this.reload()) : this.reload();
  }

  componentWillUnmount() {
    airloy.event.off(EventTypes.taskChange);
    analytics.onPageEnd('page_project');
  }

  async reload() {
    this.setState({
      isRefreshing: true
    });
    let result = await airloy.net.httpGet(api.task.list, {projectId: this.project.id});
    if (result.success) {
      this.listSource = new ListSource(result.info);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.listSource.datas),
        isRefreshing: false
      });
    } else {
      result.message !== 'error.request.auth' && this.setState({
        isRefreshing: false
      });
      toast(L(result.message));
    }
  }

  _toArrange(rowData, arrangable) {
    if (arrangable) {
      let BUTTONS = ['安排到今天', '安排到明天', '安排到后天', '取消'];
      let CANCEL_INDEX = 3;
      ActionSheet.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          tintColor: colors.dark2
        },
        async (buttonIndex) => {
          if (buttonIndex !== CANCEL_INDEX) {
            hang();
            let newDate = new Date(this.today + 86400000 * buttonIndex);
            let result = await airloy.net.httpGet(api.task.arrange, {
                id: rowData.id,
                date: newDate
              }
            );
            if (result.success) {
              airloy.event.emit(EventTypes.agendaAdd, result.info);
              rowData.arranged = true;
              this.listSource.update(util.clone(rowData));
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.listSource.datas)
              });
              toast('已安排到待办列表中');
            } else {
              toast(L(result.message));
            }
            hang(false);
          }
        }
      );
    }
  }

  updateRow(rowData) {
    this.listSource.update(rowData);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.listSource.datas)
    });
    this.props.navigator.pop();
  }

  deleteRow(rowData) {
    this.listSource.remove(rowData);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.listSource.datas)
    });
    this.project.subTotal--;
    rowData.status === '0' && this.project.subTodo--;
    this.countChanged = true;
    this.props.navigator.pop();
  }

  _pressRow(rowData, editable) {
    this.props.navigator.push({
      title: editable ? '修改子任务' : '查看子任务',
      component: EditTask,
      rightButtonIcon: require('../../../resources/icons/trash.png'),
      passProps: {
        data: rowData,
        editable: editable,
        onUpdated: (rowData) => this.updateRow(rowData),
        onDeleted: (rowData) => this.deleteRow(rowData)
      }
    });
  }

  _renderRow(rowData, sectionId, rowId) {
    let transform, arrangable = true, editable = true;
    if (rowData.status === '1') {
      transform = {
        icon: <Image source={require('../../../resources/icons/checked.png')} style={styles.iconSmall} />,
        titleColor: colors.border,
        detailColor: colors.border
      };
      arrangable = editable = false;
    } else if (rowData.arranged) {
      transform = {
        icon: <Image source={require('../../../resources/icons/arranged.png')} style={styles.iconSmall} />,
        titleColor: colors.dark2,
        detailColor: colors.dark2
      };
      arrangable = false;
    } else {
      transform = {
        icon: <Image source={require('../../../resources/icons/arrange.png')} style={style.arrange} />,
        titleColor: colors.dark1,
        detailColor: colors.dark2
      };
    }
    return (
      <TouchableOpacity style={style.container} onPress={() => this._pressRow(rowData, editable)}>
        <TouchableOpacity onPress={() => this._toArrange(rowData, arrangable)} style={style.icon}>
          {transform.icon}
        </TouchableOpacity>
        <View style={styles.flex}>
          <Text style={[styles.title, {color: transform.titleColor}]}>{rowData.title}</Text>
          {rowData.detail ? <Text style={[styles.text, {color: transform.detailColor}]}>{rowData.detail}</Text> : null}
        </View>
      </TouchableOpacity>
    );
  }

  _renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
    return <View key={rowId + '_separator'} style={styles.hr}></View>
  }

  _renderSectionHeader(sectionData, sectionId) {
    return sectionData.detail ? (
      <View style={style.header}>
        <Text style={styles.text}>{sectionData.detail}</Text>
      </View>)
      : null;
  }

  render() {
    return (
      <ListView
        enableEmptySections={true}
        initialListSize={10}
        pageSize={5}
        dataSource={this.state.dataSource}
        renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, sectionId, rowId)}
        renderSeparator={this._renderSeparator}
        renderSectionHeader={this._renderSectionHeader}
        refreshControl={<RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this.reload()}
                            tintColor={colors.accent}
                            title={'加载中...'}
                            colors={[colors.accent, colors.action]}
                            progressBackgroundColor={colors.bright1}
                         />}
      />
    );
  }
}


const style = StyleSheet.create({
  header: {
    paddingTop: 16,
    paddingLeft: 24,
    paddingRight: 16,
    paddingBottom: 8,
    borderBottomWidth: px1,
    borderBottomColor: colors.bright2,
    backgroundColor: colors.bright1
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingRight: 16,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  icon: {
    paddingLeft: 16,
    paddingRight: 10
  },
  arrange: {
    tintColor: colors.dark2
  }
});
