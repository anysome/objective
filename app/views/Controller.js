/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
'use strict';

import React, { Component, LayoutAnimation} from 'react-native';
import app from '/../app/app';

export default class Controller extends Component {

    constructor(props) {
        var {frame, tabBarItem, ...others} = props;
        super(others);
        this.frame = frame;
        this.loading = false;
        this.stale = false;
    }

    get route() {
        return this.props.navigator.navigationContext.currentRoute;
    }

    isVisible(controllerName) {
        return this.frame.isPageActive(controllerName);
    }

    get visible() {
        // simulator works well, fuck on real ios device, this.constructor.name = 't'
        //alert('controller name = ' + this.constructor.name);
        return this.frame.isPageActive(this.constructor.name);
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
        if ( ! this.loading ) {
            this.loading = true;
            await this._reload();
            this.stale = false;
            this.loading = false;
        }
    }

    componentDidMount() {
        app.airloy.event.on('tab.change', (tabPage)=> {
            if ( this.stale && tabPage === this.constructor.name ) {
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
        console.log(`-------- "${this.constructor.name}" unmounting`);
    }

    //shouldComponentUpdate(nextProps, nextState) {
    //    if ( new Date().getTime() - this.today > 86400000 ) {
    //        // new day is arrival,
    //        this.today += 86400000;
    //    }
    //    return true;
    //}

}