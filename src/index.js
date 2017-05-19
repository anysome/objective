/**
 * Created by Layman <anysome@gmail.com> (http://github.com/anysome) on 2016/11/8.
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
    let isAuth = false;
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

  signed() {
    airloy.net.httpGet(api.target.schedule);
    this.setState({
      logined: true
    });
  }

  render() {
    return this.state.loading ? <IntroPage /> :
      this.state.logined ?
        <MainPage /> : <LoginPage onSigned={()=>this.signed()}/>;
  }
}
