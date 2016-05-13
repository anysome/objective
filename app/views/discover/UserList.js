/**
 * Created by Layman(http://github.com/anysome) on 16/3/4.
 */
import React from 'react';
import {
  StyleSheet, ListView, RefreshControl,
  Image, View, Text, TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {airloy, styles, colors, config, api, toast, L} from '../../app';

import Facade from '../discover/Facade';

export default class UserList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
    this._renderRow = this._renderRow.bind(this);
  }

  componentDidMount() {
    this.reload();
  }

  async reload() {
    this.setState({
      isRefreshing: true
    });
    let url = this.props.isFans ? api.discover.fans : api.discover.follows;
    let result = await airloy.net.httpGet(url, {id: this.props.userId});
    if (result.success) {
      this.setState({
        isRefreshing: false,
        dataSource: this.state.dataSource.cloneWithRows(result.info)
      });
    } else {
      result.message !== 'error.request.auth' && this.setState({
        isRefreshing: false
      });
      toast(L(result.message));
    }
  }

  _pressRow(user) {
    if (this.props.keepRoute) {
      this.props.navigator.push({
        title: '个人主页',
        component: Facade,
        navigationBarHidden: false,
        passProps: {
          data: user
        }
      });
    } else {
      this.props.navigator.push({
        title: '个人主页',
        component: Facade,
        navigationBarHidden: false,
        leftButtonTitle: ' 返回',
        onLeftButtonPress: () => this.props.navigator.popToTop(),
        passProps: {
          data: user
        }
      });
    }

  }

  _renderRow(user, sectionId, rowId, highlightRow) {
    let judge = this.props.isFans ? user.followed : user.faned;
    return (
      <TouchableOpacity style={style.row} onPress={() => this._pressRow(user)}>
        <Image style={style.avatar} source={{uri: `${config.host.avatar + user.id}-60`}}
               defaultSource={require('../../../resources/images/avatar.png')}/>
        <View style={styles.containerV}>
          <Text>{user.name}</Text>
          <Text style={style.hint}>{user.signature}</Text>
        </View>
        <Icon size={20} name={judge ? 'arrow-swap' : 'checkmark'} color={colors.border} style={style.icon}/>
      </TouchableOpacity>
    );
  }

  _renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
    return <View key={rowId + '_separator'} style={styles.hr}></View>
  }

  render() {
    return <ListView enableEmptySections={true}
                     initialListSize={10}
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

    />;
  }
}

const style = StyleSheet.create({
  avatar: {
    marginLeft: 16,
    marginRight: 8,
    width: 50,
    height: 50
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.light1,
    paddingTop: 10,
    paddingBottom: 10
  },
  icon: {
    marginLeft: 8,
    marginRight: 16,
  },
  hint: {
    flex: 1,
    fontSize: 12,
    paddingTop: 4,
    color: colors.border
  },
  link: {
    flex: 1,
    fontSize: 12,
    color: colors.accent
  }
});
