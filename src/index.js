/**
 * Created by Layman <anysome@gmail.com> (http://github.com/anysome) on 2016/11/8.
 */
import React from 'react';

import IntroPage from './views/inlet/Intro';
import LoginPage from './views/inlet/Login';
import TransferDataPage from './views/inlet/TransferDataPage';
import MainPage from './views/inlet/Frame';

import {airloy, config, api} from './app';

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      firstTime: false,
      loading: true,
      logined: false,
      transferStage: 0
    };
  }

  componentDidMount() {
    this._init();
  }

  async _init() {
    let oldVersion = await airloy.store.getItem('app_version');
    let version = require('../package.json').version;
    let newInstall = version !== oldVersion;
    let isAuth = false, transferStage = 0;
    if (newInstall) {
      airloy.store.setItem('app_version', version);
    } else {
      isAuth = await airloy.auth.setup();
      let user = airloy.auth.getUser();
      transferStage = user.transfer;
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
      logined: isAuth,
      transferStage: transferStage
    });
  }

  signed(transfer) {
    if (transfer > 5) {
      airloy.net.httpGet(api.target.schedule);
    }
    this.setState({
      logined: true,
      transferStage: transfer
    });
  }

  render() {
    return this.state.loading ? <IntroPage /> :
      this.state.logined ?
        this.state.transferStage > 5 ? <MainPage /> : <TransferDataPage stage={this.state.transferStage} onSigned={(transfer)=>this.signed(transfer)}/>
        : <LoginPage onSigned={(transfer)=>this.signed(transfer)}/>;
  }
}
