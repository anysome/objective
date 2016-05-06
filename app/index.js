/**
 * Created by Layman(http://github.com/anysome) on 16/4/18.
 */

import React from 'react';

import SplashPage from './views/inlet/Splash';
//import IntroPage from './views/inlet/Intro';
import LoginPage from './views/inlet/Login';
import MainPage from './views/inlet/Frame';

import {airloy, config} from './app';

export default class App extends React.Component {

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
    if (newInstall) {
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
    this.setState({
      logined: true
    });
  }

  render() {
    return this.state.loading ? <SplashPage /> :
      //this.state.firstTime ? <IntroPage /> :
      this.state.logined ? <MainPage /> : <LoginPage onSigned={()=>this.signed()}/>;
  }
}
