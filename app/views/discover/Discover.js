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

export default class Discover extends Controller {

  constructor(props) {
    super(props);
    this.name = 'Discover';
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

  _toTarget() {
    this.forward({
      title: '淘目标',
      component: TargetList
    });
    analytics.onEvent('click_target_store');
  }

  async reload() {
    console.log('nothing to reload');
  }

  render() {
    return (
      <ScrollView>
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

      </ScrollView>
    );
  }
}
