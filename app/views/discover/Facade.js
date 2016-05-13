/**
 * Created by Layman(http://github.com/anysome) on 16/3/13.
 */
import React from 'react';
import {StyleSheet, ScrollView, View, Text, Image, TouchableOpacity} from 'react-native';

import app, {config, airloy, styles, colors, api, L, toast} from '../../app';
import util from '../../libs/Util';
import ContentList from './ContentList';
import UserList from './UserList';

export default class Facade extends React.Component {

  constructor(props) {
    let {data, ...others} = props;
    super(others);
    this.user = data;
    this.state = {
      tab: 0
    };
  }

  componentDidMount() {
    let route = this.props.navigator.navigationContext.currentRoute;
    if (this.user.followed) {
      route.rightButtonTitle = '取消关注';
      route.onRightButtonPress = async() => {
        let result = await airloy.net.httpGet(api.discover.user.unfollow, {followId: this.user.id});
        if (result.success) {
          //this.user.followed = false;
          //this.user.follows = this.user.follows - result.info;
          toast('已取消关注');
        } else {
          toast(L(result.message));
        }
      };
    } else {
      route.rightButtonTitle = '关注';
      route.onRightButtonPress = async() => {
        let result = await airloy.net.httpGet(api.discover.user.follow, {followId: this.user.id});
        if (result.success) {
          //this.user.followed = true;
          //this.user.follows = this.user.follows + result.info;
          toast('已关注');
        } else {
          toast(L(result.message));
        }
      };
    }
    // so many bugs on android T_T
    util.isAndroid() ?
      this.props.navigator.replaceAtIndex(route, -1) :
      this.props.navigator.replace(route);
  }

  _renderList() {
    let list;
    switch (this.state.tab) {
      case 0 :
        list = <ContentList userId={this.user.id}/>;
        break;
      case 1 :
        // set key to identify as different ui components, otherwise the list data will not reload.
        list = <UserList key='follow' userId={this.user.id} isFans={false} navigator={this.props.navigator}/>;
        break;
      case 2 :
        list = <UserList key='fans' userId={this.user.id} isFans={true} navigator={this.props.navigator}/>;
    }
    return list;
  }

  _changeTab(tab) {
    if (this.state.tab !== tab) {
      this.setState({
        tab: tab
      });
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={style.row}>
          <Image style={{width:100, height:100, marginRight: 16}}
                 source={{uri:`${config.host.avatar + this.user.id}-100`}}
                 defaultSource={require('../../../resources/images/avatar.png')}/>
          <View style={style.info}>
            <View style={styles.containerF}>
              <Text style={styles.title}>{this.user.name}</Text>
              <Text style={styles.hint}>{'ID: ' + this.user.uid}</Text>
            </View>
            <Text style={styles.text}>{this.user.signature}</Text>
            <View style={style.tab}>
              <TouchableOpacity onPress={() => this._changeTab(0)}>
                <Text style={this.state.tab === 0 ? style.link : styles.text}>
                  {'分享 ' + this.user.contents}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._changeTab(1)}>
                <Text style={this.state.tab === 1 ? style.link : styles.text}>
                  {'关注 ' + this.user.follows}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._changeTab(2)}>
                <Text style={this.state.tab === 2 ? style.link : styles.text}>
                  {'粉丝 ' + this.user.fans}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {this._renderList()}
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.light1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    height: 100
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end'
  },
  link: {
    flex: 1,
    color: colors.accent,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent
  }
});
