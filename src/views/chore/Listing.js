/**
 * Created by Layman(http://github.com/anysome) on 16/8/20.
 */
import React from 'react';
import {StyleSheet, RefreshControl, ListView, InteractionManager,
  View, Text, LayoutAnimation, TouchableOpacity, Alert, Image} from 'react-native';

import {analytics, airloy, styles, colors, api, toast, L, hang} from '../../app';
import util from '../../libs/Util';
import ListSource from '../../logic/ListSource';

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
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
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

  componentWillUnMount() {
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
          this.props.navigator.pop();
          this.listSource.update(util.clone(rowData));
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.listSource.datas)
          });
        }
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
      <TouchableOpacity style={style.container} onPress={() => this._pressRow(rowData, sectionId)}
                        onLongPress={() => this._addTask(rowData)}>
        <TouchableOpacity onPress={() => this._toProject(rowData)} style={style.icon}>
          <Image source={require('../../../resources/icons/create.png')} style={style.edit} />
        </TouchableOpacity>
        <Text style={styles.title}>{rowData.title}</Text>
        <Text style={styles.hint}>{rowData.subTodo} / {rowData.subTotal}</Text>
      </TouchableOpacity>
    );
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


const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  icon: {
    paddingLeft: 16,
    paddingRight: 10
  },
  edit: {
    tintColor: colors.dark2
  }
});
