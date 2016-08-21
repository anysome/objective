/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
import React from 'react';
import {ScrollView, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {analytics, config, airloy, styles, colors, api, L, toast} from '../../app';

import Controller from '../Controller';
import ArticleList from './ArticleList';
import Happiness from './Happiness';
import Feedback from './Feedback';
import Upgrade from './Upgrade';
import Setting from './Setting';

export default class Discover extends Controller {

  constructor(props) {
    super(props);
    this.name = 'Discover';
    this.user = airloy.auth.getUser();
    this.state = {
      accountType: this.user.accountType
    };
  }

  _toArticle() {
    this.forward({
      title: '鸡汤文章',
      component: ArticleList
    });
    analytics.onEvent('click_article_list');
  }

  _toHappiness() {
    this.forward({
      title: '幸福指数',
      component: Happiness,
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
      accountType: this.user.accountType
    };
    this.props.navigator.pop();
  }

  _forward(title:String, component) {
    this.forward({
      title: title,
      component: component,
      navigationBarHidden: false
    });
  }

  async reload() {
    console.log('nothing to reload');
  }

  render() {
    return (
      <ScrollView>

        <View style={styles.section}>
        { this.state.accountType === 'astmp' ?
          <TouchableOpacity style={styles.sectionRow} onPress={() => this._toUpgrade()}>
            <Text>安家落户</Text>
            <Icon size={20} name="ios-arrow-forward" color={colors.border}/>
          </TouchableOpacity>
          : [
          <TouchableOpacity style={styles.sectionRow} key={'1'} onPress={() => this._toHappiness()}>
            <Text>幸福指数</Text>
            <Icon size={20} name="ios-arrow-forward" color={colors.border}/>
          </TouchableOpacity> ,
          <View style={styles.hr} key={'2'}/> ,
          <TouchableOpacity style={styles.sectionRow} key={'3'} onPress={() => this._toFeedback()}>
            <Text>意见反馈</Text>
            <Icon size={20} name="ios-arrow-forward" color={colors.border}/>
          </TouchableOpacity>
          ]
        }
          <View style={styles.hr}/>
          <TouchableOpacity style={styles.sectionRow} onPress={() => this._toArticle()}>
            <Text>鸡汤文章</Text>
            <Icon size={20} name="ios-arrow-forward" color={colors.border}/>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.row} activeOpacity={0.5} onPress={() => this._forward('设置', Setting)}>
          <Text>设置</Text>
          <Icon size={20} name="ios-arrow-forward" color={colors.border}/>
        </TouchableOpacity>

      </ScrollView>
    );
  }
}
