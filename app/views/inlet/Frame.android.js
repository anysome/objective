/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
'use strict';

import React, {
    StyleSheet,
    Navigator,
    Component,
    Modal,
    Text,
    View,
    Button
} from 'react-native';

import app from '/../app/app';

import Agenda from '../agenda/Agenda';
import Check from '../check/Check';
import Me from '../me/Me';
import Discover from '../discover/Discover';

import Icon from 'react-native-vector-icons/Ionicons';

const iconSize = 28;

export default class Main extends Component {

    constructor() {
        super();
        this.state = {
            swipeToClose: true,
            currentPage: Agenda
        };
    }

    componentWillUnmount() {
        console.log(`-------- ${this.name} unmounting`);
    }

    selectTab(tabPage) {
        if ( this.state.currentPage === tabPage ) {

        } else {
            this.setState({currentPage: tabPage});
        }
    }

    _toAdd() {
        console.log("todo open add anything view");
    }

    _renderNavigator(component, title, hideBar = false){
        return <Navigator
            style={{flex:1}}
            navigationBarHidden={hideBar}
            titleTextColor={app.colors.dark1}
            tintColor={app.colors.accent}
            translucent={true}
            includeOpaqueBars={false}
            navTintColor={app.colors.light1}
            itemWrapperStyle={styles.navigation}
            initialRoute={{
				component: component,
				title: title,
				passProps:{
					frame: this,
			  	}
        	}}
        />;
    }

    onClose() {
        console.log('Modal just closed');
    }
    onOpen() {
        console.log('Modal just openned');
    }
    onClosingState(state) {
        console.log('the open/close of the swipeToClose just changed');
    }
    toggleSwipeToClose() {
        this.setState({swipeToClose: !this.state.swipeToClose});
    }

    render() {
        return (
            <View >
                <TabBarIOS tintColor={app.colors.accent}
                           barTintColor={app.colors.dark1}
                           translucent={true}>
                    <Icon.TabBarItem
                        title="待办"
                        iconName="ios-star-outline"
                        selectedIconName="ios-star"
                        iconSize={iconSize}
                        selected={this.state.currentPage === Agenda}
                        onPress={() => this.selectTab(Agenda)}>
                        {this._renderNavigator(Agenda, "今日待办")}
                    </Icon.TabBarItem>
                    <Icon.TabBarItem
                        title="检查"
                        iconName="ios-checkmark-outline"
                        selectedIconName="ios-checkmark"
                        iconSize={iconSize}
                        selected={this.state.currentPage === Check}
                        onPress={() => this.selectTab(Check)}>
                        {this._renderNavigator(Check, "检查单")}
                    </Icon.TabBarItem>
                    <Icon.TabBarItem iconName="ios-plus-outline" title={null} iconSize={36}
                                     style={{flex:1, paddingTop:20}}
                                     onPress={() => this._toAdd()}>
                    </Icon.TabBarItem>
                    <Icon.TabBarItem
                        title="我"
                        iconName="ios-person-outline"
                        selectedIconName="ios-person"
                        iconSize={iconSize}
                        selected={this.state.currentPage === Me}
                        onPress={() => this.selectTab(Me)}>
                        {this._renderNavigator(Me, "个人", true)}
                    </Icon.TabBarItem>
                    <Icon.TabBarItem
                        title="发现"
                        iconName="ios-world-outline"
                        selectedIconName="ios-world"
                        iconSize={iconSize}
                        selected={this.state.currentPage === Discover}
                        onPress={() => this.selectTab(Discover)}>
                        {this._renderNavigator(Discover, "广场")}
                    </Icon.TabBarItem>
                </TabBarIOS>
                <Modal style={styles.modal}
                       swipeToClose={this.state.swipeToClose}
                       onClosed={this.onClose}
                       onOpened={this.onOpen}
                       onClosingState={this.onClosingState}>
                    <Text style={styles.text}>Basic modal</Text>
                    <Button onPress={() =>this.toggleSwipeToClose()} style={styles.btn}>Disable swipeToClose({this.state.swipeToClose ? "true" : "false"})</Button>
                </Modal>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        margin: 10,
        backgroundColor: "#3B5998",
        color: "white",
        padding: 10
    },
    navigation: {
        backgroundColor: app.colors.light2
    }
});