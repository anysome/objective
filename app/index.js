/**
 * Created by Layman(http://github.com/anysome) on 16/4/18.
 */

import React from 'react';

import IntroPage from './views/inlet/Intro';
import LoginPage from './views/inlet/Login';
import MainPage from './views/inlet/Frame';

import {airloy, config, api} from './app';

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      firstTime: false,
      loading: true,
      logined: false
    };
  }

  componentDidMount() {
    this._init();
  }

  async _init() {
    let oldVersion = await airloy.store.getItem('app_version');
    let version = require('../package.json').version;
    let newInstall = version !== oldVersion;
    var isAuth = false;
    if (newInstall) {
      airloy.store.setItem('app_version', version);
    } else {
      isAuth = await airloy.auth.setup();
    }
    // forward to login page if necessary
    airloy.event.on(airloy.event.authRequiredEvent, ()=> {
      this.setState({logined: false});
    });
    airloy.event.on(airloy.event.logoutEvent, ()=> {
      this.setState({logined: false});
    });
    this.setState({
      //firstTime: newInstall,
      loading: false,
      logined: isAuth
    });
  }

  signed(recruit) {
    console.log('is recruit user ? ' + recruit);
    recruit && airloy.net.httpGet(api.discover.target.join, {
        id: '96e449c1509644d689f2a9c8f3f096bc'// 共享目标日常计划的id
      }
    );
    this.setState({
      logined: true
    });
  }

  render() {
    // return //this.state.firstTime ? <IntroPage /> :

    return this.state.loading ? <IntroPage /> :
        this.state.logined ? <MainPage /> : <LoginPage onSigned={(recruit)=>this.signed(recruit)}/>;
  }
}
