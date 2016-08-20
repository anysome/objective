/**
 * Created by Layman <anysome@gmail.com> (http://github.com/anysome) on 16/7/10.
 */
import React from 'react';
import {StyleSheet, ScrollView, View, Text, Image, TouchableOpacity,
  RefreshControl, ListView, PixelRatio} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import objective from '../../logic/Objective';
import {config, airloy, styles, colors, api, L, toast} from '../../app';
import util from '../../libs/Util';
import ListSource from '../../logic/ListSource';

import Content from './Content';

export default class ContentList extends React.Component {

  constructor(props) {
    super(props);
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

  componentDidMount() {
    this.reload();
  }

  async reload() {
    console.log('load data by sub class');
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
          <Image style={style.avatar}
                 source={{uri:`${config.host.image}${rowData.userAvatar}-100`}}
                 defaultSource={require('../../../resources/images/avatar.png')}/>
          <View style={styles.containerV}>
            <View style={styles.containerF}>
              <Text style={styles.text}>{rowData.userName}</Text>
              <Text style={styles.hint}>{rowData.uid}</Text>
            </View>
            <View style={styles.containerF}>
              <Text style={style.date}>{moment(rowData.createTime).calendar()}</Text>
              <Text style={style.count}>{rowData.comments}</Text>
              <Icon size={20} name='md-text' color={colors.light2} style={style.icon}/>
              <Text style={style.count}>{rowData.likes}</Text>
              <TouchableOpacity onPress={() => this._like(rowData)}>
                <Icon size={20} name='ios-heart' color={colors.light2} style={style.icon}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.containerV}>
          <View style={style.container}>
            <Text style={style.text}>{checkDaily.title}</Text>
            <Text style={style.times}>
              {`${checkDaily.total} + ${checkDaily.times} ${objective.getUnitName(checkDaily.unit)}`}
            </Text>
          </View>
          {log && <Text style={style.text}>{rowData.log}</Text>}
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.flex}>
        <ListView initialListSize={10}
                  pageSize={5}
                  dataSource={this.state.dataSource}
                  renderRow={this._renderRow}
          // renderHeader={this._renderHeader}
          // stickyHeaderIndices={[0]}
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
    backgroundColor: colors.light1,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: colors.light3,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: colors.light3
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 5
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    borderColor: colors.light2,
    borderWidth: 1 / PixelRatio.get(),
    backgroundColor: colors.light3
  },
  text: {
    flex: 1,
    color: colors.dark1,
    fontSize: 14
  },
  avatar: {
    marginRight: 16,
    width: 40,
    height: 40,
  },
  icon: {
    marginLeft: 8
  },
  date: {
    flex: 1,
    fontSize: 12,
    paddingTop: 4,
    textAlign: 'left',
    color: colors.dark1
  },
  times: {
    textAlign: 'right',
    fontSize: 12,
    color: colors.dark2
  },
  count: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.border
  }
});
