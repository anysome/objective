/**
 * Created by Layman(http://github.com/anysome) on 16/2/20.
 */
'use strict';

import React, {AppRegistry, Component} from 'react-native';

import SplashPage from './app/views/inlet/Splash';
//import IntroPage from './app/views/inlet/Intro';
import LoginPage from './app/views/inlet/Login';
import MainPage from './app/views/inlet/Frame';

import {airloy, config} from './app/app';

class App extends Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            firstTime: false,
            logined: false
        };
    }

    componentDidMount() {
        this._init();
    }

    async _init() {
        let oldVersion = await airloy.store.getItem('app_version');
        let version = config.objective.version;
        let newInstall = version !== oldVersion;
        var isAuth = false;
        if ( newInstall ) {
            airloy.store.setItem('app_version', version);
        } else {
            isAuth = await airloy.auth.setup();
        }
        this.setState({
            loading: false,
            //firstTime: newInstall,
            logined: isAuth
        });
        // forward to login page if necessary
        airloy.event.on(airloy.event.authRequiredEvent, ()=> {
            this.setState({logined: false});
        });
        airloy.event.on(airloy.event.logoutEvent, ()=> {
            this.setState({logined: false});
        });
    }

    signed() {
        //AppRegistry.unmountApplicationComponentAtRootTag(1);
        //AppRegistry.runApplication('objective', {rootTag:1, initialProps:{}});
        //AppRegistry.registerComponent('objective', () => App);
        this.setState({
            logined: true
        });
    }

    render() {
        return this.state.loading ? <SplashPage /> :
            //this.state.firstTime ? <IntroPage /> :
                this.state.logined ? <MainPage /> : <LoginPage onSigned={()=>this.signed()} />;
    }
}

AppRegistry.registerComponent('objective', () => App);