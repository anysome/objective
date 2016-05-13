/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
import React from 'react';
import {LayoutAnimation} from 'react-native';
import {airloy} from '../app';
import EventTypes from '../logic/EventTypes';

export default class Controller extends React.Component {

  constructor(props) {
    var {frame, tabBarItem, ...others} = props;
    super(others);
    this.frame = frame;
    this.loading = false;
    this.stale = false;
    this.name = 'Controller';
  }

  get route() {
    return this.props.navigator.navigationContext.currentRoute;
  }

  get visible() {
    // DO NOT USE this.constructor.name , minify js bundle will get wrong name.
    return this.frame.isPageActive(this.name);
  }

  get today() {
    return this.frame.getToday();
  }

  getIcon(iconName) {
    return this.frame.getIcon(iconName);
  }

  forward(route) {
    this.props.navigator.push(route);
  }

  backward() {
    this.props.navigator.pop();
  }

  markStale() {
    this.stale = true;
  }

  async _reload() {

  }

  async reload() {
    if (!this.loading) {
      this.loading = true;
      await this._reload();
      this.stale = false;
      this.loading = false;
    }
  }

  componentDidMount() {
    airloy.event.on(EventTypes.tabChange, (tabPage)=> {
      if (this.stale && tabPage === this.name) {
        console.log(`stale tab "${tabPage}" reload while showing`);
        this.reload();
      }
    });
    this.reload();
  }

  componentWillUpdate(props, state) {
    // animate
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  componentWillUnmount() {
    console.log(`-------- "${this.name}" unmounting`);
  }

}
