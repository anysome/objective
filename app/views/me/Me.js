/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
import React from 'react';
import {ScrollView, RefreshControl, View, Text, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {styles, colors, airloy, config, api, toast, L} from '../../app';

import Controller from '../Controller';
import Profile from './Profile';
import Dones from '../agenda/Dones';
import Feedback from './Feedback';
import ContentList from '../discover/ContentList';
import UserList from '../discover/UserList';
import Message from './Message';
import Setting from './Setting';
import Upgrade from './Upgrade';


export default class Me extends Controller {
  constructor(props) {
    super(props);
    this.name = 'Me';
    this.user = airloy.auth.getUser();
    this.state = {
      accountType: this.user.accountType,
      name: this.user.name,
      uid: this.user.uid
    };
  }

  componentDidMount() {
    // if accountType != astmp and uid === 0  then open social
    if (this.user.accountType !== 'astmp' && this.user.uid === 0) {
      this._openSocial();
    }
  }

  async _openSocial() {
    let result = await airloy.net.httpGet(api.me.open);
    if (result.success) {
      this.user.uid = result.info;
      this.setState({
        uid: result.info
      });
      airloy.auth.updateUser(this.user);
    }
  }

  _toDones() {
    this.forward({
      title: '我的成就',
      component: Dones,
      navigationBarHidden: false
    });
  }

  _toFeedback() {
    this.forward({
      title: '我的反馈',
      component: Feedback,
      navigationBarHidden: false,
      passProps: {
        nextIcon: this.getIcon('ios-trash-outline')
      }
    });
  }

  _toContent() {
    this.forward({
      title: '我的分享',
      component: ContentList,
      navigationBarHidden: false,
      passProps: {
        userId: this.user.id,
        nextIcon: this.getIcon('ios-trash-outline')
      }
    });
  }

  _toFollow() {
    this.forward({
      title: '我关注的',
      component: UserList,
      navigationBarHidden: false,
      passProps: {
        userId: this.user.id,
        keepRoute: true
      }
    });
  }

  _toFan() {
    this.forward({
      title: '我的粉丝',
      component: UserList,
      navigationBarHidden: false,
      passProps: {
        isFans: true,
        userId: this.user.id,
        keepRoute: true
      }
    });
  }

  _toProfile() {
    if (this.user.accountType === 'astmp') {
      this._toUpgrade();
    } else {
      this.forward({
        title: '个人信息',
        component: Profile,
        navigationBarHidden: false,
        passProps: {
          onUpdated: (name) => this.updateUser(name)
        }
      });
    }
  }

  updateUser(name) {
    this.setState({name: name});
    this.props.navigator.pop();
  }

  _toUpgrade() {
    this.forward({
      title: '升级帐号',
      component: Upgrade,
      navigationBarHidden: false,
      passProps: {
        onUpgraded: () => this.upgradeUser()
      }
    });
  }

  upgradeUser() {
    this.user = airloy.auth.getUser();
    this.state = {
      accountType: this.user.accountType,
      name: this.user.name,
      uid: this.user.uid
    };
    this._openSocial();
    this.props.navigator.pop();
  }

  _forward(title:String, component:Component) {
    this.forward({
      title: title,
      component: component,
      navigationBarHidden: false
    });
  }

//<View style={styles.hr} />
//<TouchableOpacity onPress={() => this._forward('我的消息', Message)}>
//<View style={styles.sectionRow}>
//<Text>我的消息</Text>
//<Icon size={20} name="ios-arrow-right" color={colors.border} />
//</View>
//</TouchableOpacity>

  render() {
    console.log(' render me page');
    return (
      <ScrollView>
        <TouchableOpacity style={[styles.row, {marginTop: 0}]} onPress={() => this._toProfile()}>
          <Image style={{width:100, height:100, marginTop: 20, marginRight: 16}}
                 source={{uri:`${config.host.avatar + this.user.id}-100`}}
                 defaultSource={require('../../../resources/images/avatar.png')}/>
          <View style={styles.containerV}>
            <Text style={styles.sectionRow}>{this.state.name}</Text>
            <Text style={styles.sectionRow}>{this.state.uid}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionRow} onPress={() => this._toDones()}>
            <Text>我的成就</Text>
            <Icon size={20} name="ios-arrow-right" color={colors.border}/>
          </TouchableOpacity>
          <View style={styles.hr}/>
          <TouchableOpacity style={styles.sectionRow} onPress={() => this._toFeedback()}>
            <Text>我的反馈</Text>
            <Icon size={20} name="ios-arrow-right" color={colors.border}/>
          </TouchableOpacity>
        </View>
        { this.state.accountType === 'astmp' ?
          <TouchableOpacity style={styles.row} activeOpacity={0.5} onPress={() => this._toUpgrade()}>
            <Text>安家落户</Text>
            <Icon size={20} name="ios-arrow-right" color={colors.border}/>
          </TouchableOpacity>
          :
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionRow} onPress={() => this._toContent()}>
              <Text>分享</Text>
              <Icon size={20} name="ios-arrow-right" color={colors.border}/>
            </TouchableOpacity>
            <View style={styles.hr}/>
            <TouchableOpacity style={styles.sectionRow} onPress={() => this._toFollow()}>
              <Text>{L('banner.me.follows')}</Text>
              <Icon size={20} name="ios-arrow-right" color={colors.border}/>
            </TouchableOpacity>
            <View style={styles.hr}/>
            <TouchableOpacity style={styles.sectionRow} onPress={() => this._toFan()}>
              <Text>粉丝</Text>
              <Icon size={20} name="ios-arrow-right" color={colors.border}/>
            </TouchableOpacity>
          </View>
        }
        <TouchableOpacity style={styles.row} activeOpacity={0.5} onPress={() => this._forward('设置', Setting)}>
          <Text>设置</Text>
          <Icon size={20} name="ios-arrow-right" color={colors.border}/>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
