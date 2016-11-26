/**
 * Created by Layman(http://github.com/anysome) on 16/11/24.
 */
import React from 'react';
import {RefreshControl, InteractionManager, View, Text, Alert} from 'react-native';

import SwipeableListView from 'SwipeableListView';
import SwipeableQuickActions from 'SwipeableQuickActions';
import SwipeableQuickActionButton from 'SwipeableQuickActionButton';
import TouchableBounce from 'TouchableBounce';
import ActionSheet from '@yfuks/react-native-action-sheet';
import {analytics, airloy, styles, colors, api, toast, L, hang} from '../../app';
import util from '../../libs/Util';
import ListSource from '../../logic/ListSource';
import EventTypes from '../../logic/EventTypes';
import EditProject from './EditProject';
import Project from './Project';
import EditTask from './EditTask';

export default class Listing extends React.Component {

  constructor(props) {
    super(props);
    this.listSource = null;
    this.today = props.today;
    this.state = {
      isRefreshing: true,
      dataSource: SwipeableListView.getNewDataSource()
    };
    this.rightButtonIcon = null;
  }

  componentWillMount() {
    let route = this.props.navigator.navigationContext.currentRoute;
    route.onRightButtonPress = () => {
      this.props.navigator.push({
        title: '添加',
        component: EditProject,
        passProps: {
          onUpdated: (rowData) => this.updateRow(rowData)
        }
      });
    };
    util.isAndroid() ? this.props.navigator.replacePrevious(route) : this.props.navigator.replace(route);
  }

  componentDidMount() {
    analytics.onPageStart('page_listing');
    util.isAndroid() ? InteractionManager.runAfterInteractions(() => this.reload()) : this.reload();
  }

  componentWillUnmount() {
    analytics.onPageEnd('page_listing');
  }

  async reload() {
    this.setState({
      isRefreshing: true
    });
    let result = await airloy.net.httpGet(api.project.list.focus);
    if (result.success) {
      this.listSource = new ListSource(result.info);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections({s1:this.listSource.datas}, ['s1'], null),
        isRefreshing: false
      });
    } else {
      result.message !== 'error.request.auth' && this.setState({
        isRefreshing: false
      });
      toast(L(result.message));
    }
  }

  _toEdit(rowData) {
    this.state.dataSource.setOpenRowID(null);
    this.props.navigator.push({
      title: '修改',
      component: EditProject,
      passProps: {
        data: rowData,
        onUpdated: (rowData) => this.updateRow(rowData)
      }
    });
  }

  _moreActions(rowData) {
    let BUTTONS = ['修改', '删除 ?', '取消'];
    ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
        tintColor: colors.dark2
      },
      async(buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            this._toEdit(rowData);
            break;
          case 1:
            this._toDelete(rowData);
            break;
          default:
            console.log('cancel options');
        }
      }
    );
  }

  _toDelete(rowData) {
    Alert.alert(
      '确认删除 ?',
      rowData.subTodo > 0 ? '未完成的任务可在回收站里找到.' : '彻底删除了哦!',
      [
        {text: '不了'},
        {
          text: '删除',
          onPress: async () => {
            hang();
            let result = await airloy.net.httpGet(api.project.remove, {id: rowData.id});
            if (result.success) {
              rowData.subTodo && airloy.event.emit(EventTypes.choreChange);
              this.deleteRow(rowData);
            } else {
              toast(L(result.message));
            }
            hang(false);
          }
        }
      ]
    );
  }

  _addTask(rowData) {
    this.props.navigator.push({
      title: '添加子任务',
      component: EditTask,
      passProps: {
        projectId: rowData.id,
        editable: true,
        onUpdated: (task) => {
          rowData.subTodo = rowData.subTodo + 1;
          rowData.subTotal = rowData.subTotal + 1;
          this.listSource.update(util.clone(rowData));
          this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections({s1:this.listSource.datas}, ['s1'], null)
          });
        }
      }
    });
  }

  _pressRow(rowData, sectionId) {
    this.props.navigator.push({
      title: rowData.title,
      component: Project,
      rightButtonIcon: require('../../../resources/icons/create.png'),
      passProps: {
        data: rowData,
        today: this.today,
        onUpdated: (rowData) => this.updateRow(rowData)
      }
    });
  }

  updateRow(rowData) {
    // also for add
    this.listSource.update(rowData);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections({s1:this.listSource.datas}, ['s1'], null)
    });
  }

  deleteRow(rowData) {
    this.listSource.remove(rowData);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections({s1:this.listSource.datas}, ['s1'], null)
    });
  }

  _renderRow(rowData, sectionId, rowId) {
    return (
      <TouchableBounce style={styles.listRow}
                       onPress={() => this._pressRow(rowData, sectionId)}>
        <Text style={styles.title}>{rowData.title}</Text>
        <Text style={styles.hint}>{rowData.subTodo} / {rowData.subTotal}</Text>
      </TouchableBounce>
    );
  }

  _renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
    return <View key={rowId + '_separator'} style={styles.hr}></View>
  }

  _renderActions(rowData, sectionId) {
    return (
      <SwipeableQuickActions style={styles.rowActions}>
        <SwipeableQuickActionButton imageSource={{}} text={"更多"}
                                    onPress={() => this._moreActions(rowData)}
                                    style={styles.rowAction} textStyle={styles.rowText}/>
        <SwipeableQuickActionButton imageSource={{}} text={"+任务"}
                                    onPress={() => this._addTask(rowData)}
                                    style={styles.rowActionConstructive} textStyle={styles.rowText}/>
      </SwipeableQuickActions>
    );
  }

  render() {
    return (
      <SwipeableListView
        maxSwipeDistance={130}
        renderQuickActions={(rowData, sectionId, rowId) => this._renderActions(rowData, sectionId)}
        enableEmptySections={true}
        initialListSize={10}
        pageSize={5}
        dataSource={this.state.dataSource}
        renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, sectionId, rowId)}
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
    );
  }
}
