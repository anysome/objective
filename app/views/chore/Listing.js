/**
 * Created by Layman(http://github.com/anysome) on 16/8/20.
 */
import React from 'react';
import {StyleSheet, RefreshControl, ListView,
  View, Text, LayoutAnimation, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {analytics, airloy, styles, colors, api, toast, L, hang} from '../../app';
import util from '../../libs/Util';
import ListSource from '../../logic/ListSource';

import Edit from './Edit';
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
    this.rightButtonIcon = route.rightButtonIcon;
    route.onRightButtonPress = () => {
      this.props.navigator.push({
        title: '新增',
        component: Edit,
        passProps: {
          sectionId: 1,
          onUpdated: (rowData) => this.updateRow(rowData)
        }
      });
    };
    util.isAndroid() ? this.props.navigator.replacePrevious(route) : this.props.navigator.replace(route);
  }

  componentDidMount() {
    analytics.onPageStart('page_listing');
    this.reload();
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
    this.props.navigator.push({
      title: '分类清单',
      component: Project,
      rightButtonIcon: this.props.plusIcon,
      passProps: {
        data: rowData,
        today: this.today,
        nextIcon: this.props.trashIcon,
        onUpdated: (rowData) => this.updateRow(rowData)
      }
    });
  }

  _addTask(rowData) {
    this.props.navigator.push({
      title: '新增子任务',
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
        <Icon size={28} name='ios-create-outline' style={style.icon} color={colors.border}
              onPress={() => this._toProject(rowData)}/>
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
