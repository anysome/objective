/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
import React from 'react';
import {StyleSheet, Navigator, TouchableOpacity, AppState, BackAndroid, Image,
  LayoutAnimation, Keyboard} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import NavigatorWithBar from '../../widgets/NavigatorWithBar';

import {colors, airloy, api} from '../../app';
import util from '../../libs/Util';
import EventTypes from '../../logic/EventTypes';

import Agenda from '../agenda/SwipeAgenda';
import Target from '../target/SwipeTarget';
import Anything from './Anything';
import Chore from '../chore/SwipeChore';
import Discover from '../discover/Discover';


export default class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tabBarHeight: 49,
      currentPage: 'Agenda'
    };
    this.today = util.getTodayStart();
    this.controllers = [];
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  async _autoSchedule() {
    let lastScheduleDate = await airloy.store.getItem('target.auto.schedule.date');
    if (this.today != lastScheduleDate) {
      await airloy.net.httpGet(api.target.schedule);
      airloy.store.setItem('target.auto.schedule.date', '' + this.today);
      console.debug('-------------------- did schedule');
    }
  }

  componentWillMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this._autoSchedule();

    this.backListenerHandler = BackAndroid.addEventListener('hardwareBackPress', () => {
      let navigator = this.controllers[this.state.currentPage].navigator;
      console.log('length = %o', navigator.getCurrentRoutes().length);
      if (navigator.getCurrentRoutes().length > 1) {
        navigator.pop();
        return true;
      } else {
        return false;
      }
    });
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
      this.setState({
        tabBarHeight: 0
      });
    });
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', e => {
      this.setState({
        tabBarHeight: 49
      });
    });
  }

  componentWillUpdate(props, state) {
    // animate
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.backListenerHandler.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
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

  pushController(controller) {
    console.log('name = ' + controller.name);
    this.controllers[controller.name] = controller;
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
      <TabNavigator tabBarStyle={{height: this.state.tabBarHeight}} sceneStyle={{paddingBottom: this.state.tabBarHeight}}>
        <TabNavigator.Item
          selected={this.state.currentPage === 'Agenda'}
          title="待办"
          titleStyle={style.tabUnselected}
          selectedTitleStyle={style.tabSelected}
          renderIcon={() => <Image source={require('../../../resources/icons/agenda.png')} style={style.iconUnselected} />}
          renderSelectedIcon={() => <Image source={require('../../../resources/icons/agenda.png')} style={style.iconSelected} />}
          onPress={() => this._selectTab('Agenda')}>
          <NavigatorWithBar component={Agenda} navigationBarHidden={false} title='待办' frame={this}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.currentPage === 'Target'}
          title="目标"
          selectedTitleStyle={style.tabSelected}
          renderIcon={() => <Image source={require('../../../resources/icons/target.png')} style={style.iconUnselected} />}
          renderSelectedIcon={() => <Image source={require('../../../resources/icons/target.png')} style={style.iconSelected} />}
          onPress={() => this._selectTab('Target')}>
          <NavigatorWithBar component={Target} navigationBarHidden={false} title='目标' frame={this}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.currentPage === 'Anything'}
          renderIcon={() => <Image source={require('../../../resources/icons/idea.png')} style={style.main}/>}
          renderSelectedIcon={() => <Image source={require('../../../resources/icons/idea.png')} style={style.iconUnselected} />}
          onPress={() => this._openAdd()}>
          <Anything onClose={() => this.closeAdd()}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.currentPage === 'Chore'}
          title="备忘"
          selectedTitleStyle={style.tabSelected}
          renderIcon={() => <Image source={require('../../../resources/icons/chore.png')} style={style.iconUnselected} />}
          renderSelectedIcon={() => <Image source={require('../../../resources/icons/chore.png')} style={style.iconSelected} />}
          onPress={() => this._selectTab('Chore')}>
          <NavigatorWithBar component={Chore} navigationBarHidden={false} title='备忘' frame={this}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.currentPage === 'Discover'}
          title="发现"
          selectedTitleStyle={style.tabSelected}
          renderIcon={() => <Image source={require('../../../resources/icons/discover.png')} style={style.iconUnselected} />}
          renderSelectedIcon={() => <Image source={require('../../../resources/icons/discover.png')} style={style.iconSelected} />}
          onPress={() => this._selectTab('Discover')}>
          <NavigatorWithBar component={Discover} navigationBarHidden={false} title='发现' frame={this}/>
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}

const style = StyleSheet.create({
  iconUnselected: {
    tintColor: colors.dark2
  },
  iconSelected: {
    tintColor: colors.accent
  },
  tabSelected: {
    color: colors.accent
  },
  tabUnselected: {
    color: colors.dark2
  },
  main: {
    tintColor: colors.action
  }
});
