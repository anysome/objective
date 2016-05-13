/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity,
  RefreshControl, ListView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import objective from '../../logic/Objective';
import {config, airloy, styles, colors, api, L, toast} from '../../app';
import util from '../../libs/Util';
import ListSource from '../../logic/ListSource';

import Controller from '../Controller';
import Content from './Content';
import Facade from './Facade';

export default class Discover extends Controller {

  constructor(props) {
    super(props);
    this.name = 'Discover';
    this.state = {
      isRefreshing: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      selectedRow: {},
      showModal: false
    };
    this.listSource = new ListSource();
    this._renderRow = this._renderRow.bind(this);
  }

  componentWillMount() {
  }

  async reload() {
    this.setState({
      isRefreshing: true
    });
    let result = await airloy.net.httpGet(api.content.list.public, null);
    if (result.success) {
      this.listSource = new ListSource(result.info);
      this.setState({
        isRefreshing: false,
        dataSource: this.state.dataSource.cloneWithRows(this.listSource.datas)
      });
    } else {
      // event emit will unmount this component
      result.message !== 'error.request.auth' && this.setState({
        isRefreshing: false
      });
      toast(L(result.message));
    }
  }

  _pressRow(rowData) {
    this.setState({
      selectedRow: rowData,
      showModal: true
    });
  }

  async _like(rowData) {
    let result = await airloy.net.httpGet(api.content.detail.like, {id: rowData.id});
    if (result.success) {
      if (result.info > -1) {
        rowData.likes = rowData.likes + 1;
        this.listSource.update(util.clone(rowData));
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.listSource.datas)
        });
      }
    } else {
      toast(L(result.message));
    }
  }

  async _toUser(userId) {
    let result = await airloy.net.httpGet(api.discover.user.read, {id: userId});
    console.log('user id = ' + userId);
    console.log(JSON.stringify(result));
    if (result.success) {
      this.forward({
        title: '个人主页',
        component: Facade,
        passProps: {
          data: result.info
        }
      });
    } else {
      toast(L(result.message));
    }
  }

  updateRow(rowData) {
    if (rowData) {
      this.listSource.update(util.clone(rowData));
      this.setState({
        showModal: false,
        dataSource: this.state.dataSource.cloneWithRows(this.listSource.datas)
      });
    } else {
      this.setState({
        showModal: false
      });
    }
  }

  _renderRow(rowData, sectionId, rowId) {
    let log = rowData.log ? rowData.log : false;
    let checkDaily = rowData.content ? JSON.parse(rowData.content) : {};
    return (
      <TouchableOpacity style={style.row} onPress={() => this._pressRow(rowData)}>
        <View style={style.header}>
          <TouchableOpacity onPress={() => this._toUser(rowData.userId)}>
            <Image style={style.avatar}
                   source={{uri:`${config.host.avatar + rowData.userId}-100`}}
                   defaultSource={require('../../../resources/images/avatar.png')}/>
          </TouchableOpacity>
          <View style={styles.containerV}>
            <View style={styles.containerF}>
              <Text style={styles.text}>{rowData.userName}</Text>
              <Text style={styles.hint}>{rowData.uid}</Text>
            </View>
            <View style={styles.containerF}>
              <Text style={style.hint}>{moment(rowData.createTime).calendar()}</Text>
              <Text style={style.count}>{rowData.comments}</Text>
              <Icon size={20} name='chatbubble-working' color={colors.light1} style={style.icon}/>
              <Text style={style.count}>{rowData.likes}</Text>
              <TouchableOpacity onPress={() => this._like(rowData)}>
                <Icon size={20} name='android-favorite' color={colors.light1} style={style.icon}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.containerV}>
          <View style={style.container}>
            <Text style={style.text}>{checkDaily.title}</Text>
            <Text style={styles.hint}>
              {`${checkDaily.total} + ${checkDaily.times} ${objective.getUnitName(checkDaily.unit)}`}
            </Text>
          </View>
          {log && <Text style={styles.title}>{rowData.log}</Text>}
        </View>
      </TouchableOpacity>
    );
  }

  _renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
    return <View key={rowId + '_separator'} style={style.separator}></View>
  }

  render() {
    console.log(' render discover page ');
    return (
      <View style={styles.flex}>
        <ListView initialListSize={10}
                  pageSize={5}
                  dataSource={this.state.dataSource}
                  renderRow={this._renderRow}
                  renderSeparator={this._renderSeparator}
                  refreshControl={<RefreshControl refreshing={this.state.isRefreshing}
                                                             onRefresh={() => this.reload()}
                                                             tintColor={colors.accent}
                                                             title="加载中..."
                                                             colors={['#ff0000', '#00ff00', '#0000ff']}
                                                             progressBackgroundColor="#EBEBEB" />}
        />
        <Content data={this.state.selectedRow} visible={this.state.showModal}
                 onFeedback={(rowData) => this.updateRow(rowData)}/>
      </View>
    );
  }
}


const style = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.light2,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 5
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.light1,
    padding: 8,
    marginTop: 5,
    marginBottom: 5
  },
  text: {
    flex: 1,
    color: colors.dark1,
    fontSize: 14
  },
  avatar: {
    marginRight: 16,
    width: airloy.device.os.indexOf('Phone') > -1 ? 40 : 80,
    height: airloy.device.os.indexOf('Phone') > -1 ? 40 : 80,
  },
  separator: {
    height: 10,
    backgroundColor: colors.light3,
  },
  icon: {
    marginLeft: 8,
  },
  hint: {
    flex: 1,
    fontSize: 12,
    paddingTop: 4,
    textAlign: 'left',
    color: colors.dark1
  },
  count: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.border
  }
});
