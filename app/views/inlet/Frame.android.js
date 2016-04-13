/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
'use strict';

import React from 'react';
import {StyleSheet, Navigator, TouchableOpacity, AppState, Image, Text, View} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/Ionicons';

import {colors, airloy, styles} from '../../app';
import NavigatorWithBar from '../../widgets/NavigatorWithBar';

import Agenda from '../agenda/Agenda';
import Check from '../check/Check';
import Anything from './Anything';
import Me from '../me/Me';
import Discover from '../discover/Discover';

const iconSize = 24;

export default class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 'Me'
        };
        this.icons = new Map();
        let now = new Date();
        now.setHours(0, 0,0,0);
        this.today = now.getTime();
        this._handleAppStateChange = this._handleAppStateChange.bind(this);
    }

    componentWillMount() {
        // draw icon images for later use case
        ['ios-box-outline', 'ios-more-outline', 'ios-plus-empty',
            'ios-compose-outline', 'ios-trash-outline'].forEach(name => this.icons.set(name, <Icon name={name} size={24} color={colors.accent} />));
        AppState.addEventListener('change', this._handleAppStateChange);
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
        if ( currentAppState === 'active') {
            if ( new Date().getTime() - this.today > 86400000 ) {
                this.today = this.today + 86400000;
                airloy.event.emit('target.change');
                airloy.event.emit('agenda.change');
                airloy.event.emit('me.change');
            }
            console.log(' current time = ' + this.today );
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
                    renderIcon={() => <Icon name='ios-star-outline' size={iconSize} color={colors.border} />}
                    renderSelectedIcon={() => <Icon name='ios-star' size={iconSize} color={colors.accent} />}
                    onPress={() => this.setState({currentPage: 'Agenda'})}>
                    <NavigatorWithBar component={Agenda} navigationBarHidden={false} title='待办' frame={this} />
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.currentPage === 'Check'}
                    title="检查单"
                    selectedTitleStyle={style.tabSelected}
                    renderIcon={() => <Icon name='ios-checkmark-outline' size={iconSize} color={colors.border} />}
                    renderSelectedIcon={() => <Icon name='android-checkmark-circle' size={iconSize} color={colors.accent} />}
                    onPress={() => this.setState({currentPage: 'Check'})}>
                    <NavigatorWithBar component={Check} navigationBarHidden={false} title='检查单' frame={this} />
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.currentPage === 'Anything'}
                    renderIcon={() => <Icon name='plus-round' size={iconSize} color={colors.border} />}
                    renderSelectedIcon={() => <Icon name='plus-round' size={iconSize} color={colors.accent} />}
                    onPress={() => this._openAdd()}>
                    <Anything onClose={() => this.closeAdd()} />
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.currentPage === 'Me'}
                    title="我"
                    selectedTitleStyle={style.tabSelected}
                    renderIcon={() => <Icon name='ios-person-outline' size={iconSize} color={colors.border} />}
                    renderSelectedIcon={() => <Icon name='ios-contact-outline' size={iconSize} color={colors.accent} />}
                    onPress={() => this.setState({currentPage: 'Me'})}>
                    <NavigatorWithBar component={Me} navigationBarHidden={true} title='我' frame={this} />
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.currentPage === 'Discover'}
                    title="发现"
                    selectedTitleStyle={style.tabSelected}
                    renderIcon={() => <Icon name='ios-navigate-outline' size={iconSize} color={colors.border} />}
                    renderSelectedIcon={() => <Icon name='ios-navigate' size={iconSize} color={colors.accent} />}
                    onPress={() => this.setState({currentPage: 'Discover'})}>
                    <NavigatorWithBar component={Discover} navigationBarHidden={false} title='发现' frame={this} />
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