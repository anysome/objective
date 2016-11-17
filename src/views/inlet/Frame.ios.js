/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
import React from 'react';
import {NavigatorIOS, TabBarIOS, PushNotificationIOS, AppState, AlertIOS} from 'react-native';

import {airloy, styles, colors, api} from '../../app';
import util from '../../libs/Util';
import EventTypes from '../../logic/EventTypes';

import Agenda from '../agenda/Agenda';
import Target from '../target/Target';
import Anything from './Anything';
import Chore from '../chore/Chore';
import Discover from '../discover/Discover';


export default class Frame extends React.Component {

	constructor() {
		super();
		this.lastPage = null;
		this.state = {
			currentPage: 'Agenda'
		};
    this.iconSize = 28;
    this.today = util.getTodayStart();
		this._handleAppStateChange = this._handleAppStateChange.bind(this);
	}

	componentWillMount() {
		PushNotificationIOS.addEventListener('notification', this._onNotification);
    AppState.addEventListener('change', this._handleAppStateChange);
    this._autoSchedule();
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
		PushNotificationIOS.removeEventListener('notification', this._onNotification);
    AppState.removeEventListener('change', this._handleAppStateChange);
		console.log(`-------- Frame unmounting`);
	}

	_handleAppStateChange(currentAppState) {
		if ( currentAppState === 'active') {
			if ( new Date().getTime() - this.today > 86400000 ) {
				this.today = util.getTodayStart();
        this._autoSchedule();
				airloy.event.emit(EventTypes.targetChange);
				airloy.event.emit(EventTypes.agendaChange);
				airloy.event.emit(EventTypes.meChange);
			}
			console.log(' current time = ' + this.today );
		}
	}

	getToday() {
		return this.today;
	}

	_onNotification(notification) {
		console.log(JSON.stringify(notification));
		AlertIOS.alert(
			'新的消息',
			notification.getMessage(),
			[{
				text: '知道了',
				onPress: null,
			}]
		);
	}

	_selectTab(tabPage) {
		if (this.state.currentPage === tabPage) {

		} else {
			this.setState({currentPage: tabPage});
			this.lastPage = null;
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

	_renderNavigator(component, title, hideBar = false){
		return <NavigatorIOS
			style={styles.flex}
			navigationBarHidden={hideBar}
			titleTextColor={colors.dark2}
			tintColor={colors.accent}
			translucent={true}
			includeOpaqueBars={false}
			navTintColor={'white'}
			itemWrapperStyle={styles.navigation}
			initialRoute={{
				component: component,
				title: title,
				passProps:{
					frame: this
				}
      }}
		/>;
	}

	render() {
		return (
			<TabBarIOS tintColor={colors.accent}
					   translucent={true}>
        <TabBarIOS.Item title="待办"
                        selected={this.state.currentPage === 'Agenda'}
                        icon={require('../../../resources/icons/agenda.png')}
                        onPress={() => this._selectTab('Agenda')}>
          {this._renderNavigator(Agenda, "待办")}
        </TabBarIOS.Item>
        <TabBarIOS.Item title="目标"
                        selected={this.state.currentPage === 'Target'}
                        icon={require('../../../resources/icons/target.png')}
                        onPress={() => this._selectTab('Target')}>
          {this._renderNavigator(Target, "目标")}
        </TabBarIOS.Item>
        <TabBarIOS.Item title={null}
                        selected={this.state.currentPage === 'Anything'}
                        icon={require('../../../resources/icons/add.png')}
                        onPress={() => this._openAdd()}>
          <Anything onClose={() => this.closeAdd()} />
        </TabBarIOS.Item>
        <TabBarIOS.Item title="备忘"
                        selected={this.state.currentPage === 'Chore'}
                        icon={require('../../../resources/icons/chore.png')}
                        onPress={() => this._selectTab('Chore')}>
          {this._renderNavigator(Chore, "备忘")}
        </TabBarIOS.Item>
        <TabBarIOS.Item title="发现"
                        selected={this.state.currentPage === 'Discover'}
                        icon={require('../../../resources/icons/discover.png')}
                        onPress={() => this._selectTab('Discover')}>
          {this._renderNavigator(Discover, "发现")}
        </TabBarIOS.Item>
			</TabBarIOS>
		);
	}
}
