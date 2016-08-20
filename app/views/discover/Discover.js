/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
import React from 'react';
import {ScrollView, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {analytics, config, airloy, styles, colors, api, L, toast} from '../../app';

import Controller from '../Controller';
import SharedContentList from './SharedContentList';
import TargetList from './TargetList';
import ArticleList from './ArticleList';
import Happiness from '../me/Happiness';
import Feedback from '../me/Feedback';
import Upgrade from '../me/Upgrade';
import Setting from '../me/Setting';

export default class Discover extends Controller {

  constructor(props) {
    super(props);
    this.name = 'Discover';
    this.user = airloy.auth.getUser();
    this.state = {
      accountType: this.user.accountType
    };
  }

  _toShare() {
    this.forward({
      title: '最新打卡',
      component: SharedContentList
    });
    analytics.onEvent('click_shared_content_list');
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

  _toTarget() {
    this.forward({
      title: '淘目标',
      component: TargetList
    });
    analytics.onEvent('click_target_store');
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

        { this.state.accountType === 'astmp' ?
          <TouchableOpacity style={styles.row} activeOpacity={0.5} onPress={() => this._toUpgrade()}>
            <Text>安家落户</Text>
            <Icon size={20} name="ios-arrow-forward" color={colors.border}/>
          </TouchableOpacity>
          :
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionRow} onPress={() => this._toHappiness()}>
              <Text>幸福指数</Text>
              <Icon size={20} name="ios-arrow-forward" color={colors.border}/>
            </TouchableOpacity>
            <View style={styles.hr}/>
            <TouchableOpacity style={styles.sectionRow} onPress={() => this._toFeedback()}>
              <Text>意见反馈</Text>
              <Icon size={20} name="ios-arrow-forward" color={colors.border}/>
            </TouchableOpacity>
          </View>
        }

        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionRow} onPress={() => this._toShare()}>
            <Text>最新打卡</Text>
            <Icon size={20} name="ios-arrow-forward" color={colors.border}/>
          </TouchableOpacity>
          <View style={styles.hr}/>
          <TouchableOpacity style={styles.sectionRow} onPress={() => this._toArticle()}>
            <Text>鸡汤文章</Text>
            <Icon size={20} name="ios-arrow-forward" color={colors.border}/>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.row} activeOpacity={0.5} onPress={() => this._toTarget()}>
          <Text>淘目标</Text>
          <Icon size={20} name="ios-arrow-forward" color={colors.border}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} activeOpacity={0.5} onPress={() => this._forward('设置', Setting)}>
          <Text>设置</Text>
          <Icon size={20} name="ios-arrow-forward" color={colors.border}/>
        </TouchableOpacity>

      </ScrollView>
    );
  }
}
