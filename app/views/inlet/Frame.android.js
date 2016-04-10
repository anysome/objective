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
    Button,
    TouchableOpacity
} from 'react-native';

import Tabbar, { Tab, RawContent, IconWithBar, RawIcon, glypyMapMaker} from 'react-native-tabbar';

import app from '/../app/app';

import Agenda from '../agenda/Agenda';
import Check from '../check/Check';
import Me from '../me/Me';
import Discover from '../discover/Discover';

import Icon from 'react-native-vector-icons/Ionicons';

const iconFont = 'Ionicons';
const glypy = glypyMapMaker({
    Agenda: 'f4b2',
    Check: 'f375',
    Add: 'f217',
    Me: 'f47d',
    Discover: 'f46d'
});

export default class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: Agenda
        };
        this.toggle = false;
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

    tabbarToggle() {
        this.refs['myTabbar'].getBarRef().show(this.toggle);
        this.toggle = !this.toggle;
    }

    _renderNavigator(component, title, hideBar = false){
        console.log(' init navigarot ' + title);
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
            renderScene={(route, navigator) => {
                console.log(' init route ' + route.title);
                return <route.component title={route.title} navigator={navigator} />
             }}
        />;
    }

    render() {
        return (
            <Tabbar ref="myTabbar" barColor={'gray'}>
                <Tab name="home">
                    <IconWithBar label="待办" type={glypy.Agenda} from={iconFont}/>
                    <RawContent>
                        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent:'center' }}>
                            <Text onPress={()=>this.tabbarToggle()}>Toggle Tabbar</Text>
                        </View>
                    </RawContent>
                </Tab>
                <Tab name="camera">
                    <IconWithBar label="检查单" type={glypy.Check} from={iconFont}/>
                    <RawContent>
                        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent:'center' }}>
                            <Text onPress={()=>console.log('camera')}>Camera</Text>
                        </View>
                    </RawContent>
                </Tab>
                <Tab name="stats">
                    <RawIcon>
                        <Icon style={{flex:1, alignSelf:'center', marginTop: 7}} name="plus-round" size={36} color='red'/>
                    </RawIcon>
                    <RawContent>
                        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent:'center' }}>
                            <Text onPress={()=>console.log('stats')}>Stats</Text>
                        </View>
                    </RawContent>
                </Tab>
                <Tab name="favorite">
                    <IconWithBar label="我" type={glypy.Me} from={iconFont}/>
                    <RawContent>
                        {this._renderNavigator(Me, "我", true)}
                    </RawContent>
                </Tab>
                <Tab name="settings">
                    <IconWithBar label="发现" type={glypy.Discover} from={iconFont}/>
                    <RawContent>
                        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent:'center' }}>
                            <Text onPress={()=>console.log('settings')}>Settings</Text>
                        </View>
                    </RawContent>
                </Tab>
            </Tabbar>
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