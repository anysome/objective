/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
import React from 'react';
import {StyleSheet, Navigator, TouchableOpacity, AppState, BackAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TabNavigator from 'react-native-tab-navigator';
import NavigatorWithBar from '../../widgets/NavigatorWithBar';

import {colors, airloy, api} from '../../app';
import util from '../../libs/Util';


import Agenda from '../agenda/Agenda';
import Check from '../check/Check';
import Anything from './Anything';
import Me from '../me/Me';
import Discover from '../discover/Discover';


export default class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'Me'
    };
    this.iconSize = 24;
    this.icons = new Map();
    this.today = util.getTodayStart();
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  componentWillMount() {
    // draw icon images for later use case
    ['ios-box-outline', 'ios-more-outline', 'ios-plus-empty',
      'ios-compose-outline', 'ios-trash-outline'].forEach(
          name => this.icons.set(name, <Icon name={name} size={24} color={colors.accent}/>)
    );
    AppState.addEventListener('change', this._handleAppStateChange);

    BackAndroid.addEventListener('hardwareBackPress', function() {
      
      return false;
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    console.log(`-------- ${this.name} unmounting`);
  }

  getToday() {
    return this.today;
  }

  isPageActive(tabPage) {
    //console.log(`current ${this.state.currentPage} and active is ${tabPage}`);
    return this.state.currentPage === tabPage || this.lastPage === tabPage;
  }

  getIcon(iconName) {
    return this.icons.get(iconName);
  }

  _handleAppStateChange(currentAppState) {
    if (currentAppState === 'active') {
      if (new Date().getTime() - this.today > 86400000) {
        this.today = this.today + 86400000;
        airloy.net.httpGet(api.check.list);
        airloy.event.emit('target.change');
        airloy.event.emit('agenda.change');
        airloy.event.emit('me.change');
      }
      console.log(' current time = ' + this.today);
    }
  }

  _openAdd() {
    this.lastPage = this.state.currentPage;
    this.setState({currentPage: 'Anything'});
  }

  closeAdd() {
    this.setState({currentPage: this.lastPage});
    this.lastPage = null;
  }

  render() {
    return (
      <TabNavigator>
        <TabNavigator.Item
          selected={this.state.currentPage === 'Agenda'}
          title="待办"
          selectedTitleStyle={style.tabSelected}
          renderIcon={() => <Icon name='ios-star-outline' size={this.iconSize} color={colors.border} />}
          renderSelectedIcon={() => <Icon name='ios-star' size={this.iconSize} color={colors.accent} />}
          onPress={() => this.setState({currentPage: 'Agenda'})}>
          <NavigatorWithBar component={Agenda} navigationBarHidden={false} title='待办' frame={this}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.currentPage === 'Check'}
          title="检查单"
          selectedTitleStyle={style.tabSelected}
          renderIcon={() => <Icon name='ios-checkmark-outline' size={this.iconSize} color={colors.border} />}
          renderSelectedIcon={() => <Icon name='android-checkmark-circle' size={this.iconSize} color={colors.accent} />}
          onPress={() => this.setState({currentPage: 'Check'})}>
          <NavigatorWithBar component={Check} navigationBarHidden={false} title='检查单' frame={this}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.currentPage === 'Anything'}
          renderIcon={() => <Icon name='plus-round' size={this.iconSize} color={colors.border} />}
          renderSelectedIcon={() => <Icon name='plus-round' size={this.iconSize} color={colors.accent} />}
          onPress={() => this._openAdd()}>
          <Anything onClose={() => this.closeAdd()}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.currentPage === 'Me'}
          title="我"
          selectedTitleStyle={style.tabSelected}
          renderIcon={() => <Icon name='ios-person-outline' size={this.iconSize} color={colors.border} />}
          renderSelectedIcon={() => <Icon name='ios-contact-outline' size={this.iconSize} color={colors.accent} />}
          onPress={() => this.setState({currentPage: 'Me'})}>
          <NavigatorWithBar component={Me} navigationBarHidden={true} title='我' frame={this}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.currentPage === 'Discover'}
          title="发现"
          selectedTitleStyle={style.tabSelected}
          renderIcon={() => <Icon name='ios-navigate-outline' size={this.iconSize} color={colors.border} />}
          renderSelectedIcon={() => <Icon name='ios-navigate' size={this.iconSize} color={colors.accent} />}
          onPress={() => this.setState({currentPage: 'Discover'})}>
          <NavigatorWithBar component={Discover} navigationBarHidden={false} title='发现' frame={this}/>
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}

const style = StyleSheet.create({
  tabSelected: {
    color: colors.accent
  }
});
