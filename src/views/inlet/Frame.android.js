/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
import React from 'react';
import {StyleSheet, Navigator, TouchableOpacity, AppState, BackAndroid, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TabNavigator from 'react-native-tab-navigator';
import NavigatorWithBar from '../../widgets/NavigatorWithBar';

import {colors, airloy, api} from '../../app';
import util from '../../libs/Util';
import EventTypes from '../../logic/EventTypes';

import Agenda from '../agenda/Agenda';
import Target from '../target/Target';
import Anything from './Anything';
import Chore from '../chore/Chore';
import Discover from '../discover/Discover';


export default class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'Agenda'
    };
    this.iconSize = 24;
    this.icons = new Map();
    this.today = util.getTodayStart();
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  componentWillMount() {
    // draw icon images for later use case
    ['ios-archive-outline', 'ios-more-outline', 'ios-add', 'ios-filing-outline',
      'ios-create-outline', 'ios-trash-outline', 'ios-list', 'ios-time-outline'].forEach(
          name => this.icons.set(name, <Icon name={name} size={24} color={colors.accent}/>)
    );
    AppState.addEventListener('change', this._handleAppStateChange);
    this._autoSchedule();

    BackAndroid.addEventListener('hardwareBackPress', function() {
      return false;
    });
  }

  async _autoSchedule() {
    let lastScheduleDate = await airloy.store.getItem('target.auto.schedule.date');
    if (this.today != lastScheduleDate) {
      await airloy.net.httpGet(api.target.schedule);
      airloy.store.setItem('target.auto.schedule.date', '' + this.today);
      console.debug('-------------------- did schedule');
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    console.log(`-------- ${this.name} unmounting`);
  }

  _handleAppStateChange(currentAppState) {
    if (currentAppState === 'active') {
      if (new Date().getTime() - this.today > 86400000) {
        this.today = util.getTodayStart();
        this._autoSchedule();
        airloy.event.emit(EventTypes.targetChange);
        airloy.event.emit(EventTypes.agendaChange);
        airloy.event.emit(EventTypes.meChange);
      }
      console.log(' current time = ' + this.today);
    }
  }

  getToday() {
    return this.today;
  }

  _selectTab(tabPage) {
    if (this.state.currentPage === tabPage) {

    } else {
      this.setState({currentPage: tabPage});
      airloy.event.emit(EventTypes.tabChange, tabPage);
    }
  }

  isPageActive(tabPage) {
    //console.log(`current ${this.state.currentPage} and active is ${tabPage}`);
    return this.state.currentPage === tabPage || this.lastPage === tabPage;
  }

  getIcon(iconName) {
    return this.icons.get(iconName);
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
          renderIcon={() => <Image source={require('../../../resources/icons/agenda.png')} style={style.iconUnselected} />}
          renderSelectedIcon={() => <Image source={require('../../../resources/icons/agenda.png')} />}
          onPress={() => this._selectTab('Agenda')}>
          <NavigatorWithBar component={Agenda} navigationBarHidden={false} title='待办' frame={this}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.currentPage === 'Target'}
          title="目标"
          selectedTitleStyle={style.tabSelected}
          renderIcon={() => <Image source={require('../../../resources/icons/target.png')} style={style.iconUnselected} />}
          renderSelectedIcon={() => <Image source={require('../../../resources/icons/target.png')} />}
          onPress={() => this._selectTab('Target')}>
          <NavigatorWithBar component={Target} navigationBarHidden={false} title='目标' frame={this}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.currentPage === 'Anything'}
          renderIcon={() => <Image source={require('../../../resources/icons/add.png')} style={style.iconUnselected} />}
          renderSelectedIcon={() => <Image source={require('../../../resources/icons/add.png')} />}
          onPress={() => this._openAdd()}>
          <Anything onClose={() => this.closeAdd()}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.currentPage === 'Chore'}
          title="备忘"
          selectedTitleStyle={style.tabSelected}
          renderIcon={() => <Image source={require('../../../resources/icons/chore.png')} style={style.iconUnselected} />}
          renderSelectedIcon={() => <Image source={require('../../../resources/icons/chore.png')} />}
          onPress={() => this._selectTab('Chore')}>
          <NavigatorWithBar component={Chore} navigationBarHidden={false} title='备忘' frame={this}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.currentPage === 'Discover'}
          title="发现"
          selectedTitleStyle={style.tabSelected}
          renderIcon={() => <Image source={require('../../../resources/icons/discover.png')} style={style.iconUnselected} />}
          renderSelectedIcon={() => <Image source={require('../../../resources/icons/discover.png')} />}
          onPress={() => this._selectTab('Discover')}>
          <NavigatorWithBar component={Discover} navigationBarHidden={false} title='发现' frame={this}/>
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}

const style = StyleSheet.create({
  iconUnselected: {
    tintColor: colors.border
  },
  tabSelected: {
    color: colors.accent
  }
});
