/**
 * Created by Layman(http://github.com/anysome) on 16/11/24.
 */
import React from 'react';
import {RefreshControl, InteractionManager, View, Text} from 'react-native';

import SwipeableListView from 'SwipeableListView';
import SwipeableQuickActions from 'SwipeableQuickActions';
import SwipeableQuickActionButton from 'SwipeableQuickActionButton';
import TouchableBounce from 'TouchableBounce';

import {analytics, airloy, styles, colors, api, toast, L, hang} from '../../app';
import util from '../../libs/Util';
import ListSource from '../../logic/ListSource';

import EditProject from './EditProject';
import Project from './SwipeProject';

export default class SwipeListing extends React.Component {

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

  _toProject(rowData) {
    this.props.navigator.push({
      title: '修改',
      component: EditProject,
      rightButtonIcon: require('../../../resources/icons/trash.png'),
      passProps: {
        data: rowData,
        onUpdated: (rowData) => this.updateRow(rowData),
        onDeleted: (rowData) => this.deleteRow(rowData)
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
    this.props.navigator.pop();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.listSource.datas)
    });
  }

  deleteRow(rowData) {
    this.listSource.remove(rowData);
    this.props.navigator.pop();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.listSource.datas)
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
        <SwipeableQuickActionButton imageSource={{}} text={"修改"}
                                    onPress={() => this._toProject(rowData)}
                                    style={styles.rowAction} textStyle={styles.rowText}/>
      </SwipeableQuickActions>
    );
  }

  render() {
    return (
      <SwipeableListView
        maxSwipeDistance={60}
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
