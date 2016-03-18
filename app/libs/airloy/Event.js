/**
 * Created by Layman(http://github.com/anysome) on 16/2/24.
 */
'use strict';

import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

export default class Event {

    authRequiredEvent = 'airloy:relogin';
    logoutEvent = 'airloy:logout';

    constructor() {
        this._listeners = new Map();
    }

    on(event: String, handler: Function) {
        let listener = RCTDeviceEventEmitter.addListener(event, handler);
        if ( this._listeners.has(event) ) {
            let olds = this._listeners.get(event);
            //if ( Array.isArray(olds) ) {
            olds.push(listener);
            //} else {
            //    let news = [olds, listener];
            //    this._listeners.set(event, listener);
            //}
        } else {
            this._listeners.set(event, [listener]);
        }
        //console.log(`${event} event added result is ${this._listeners.has(event)}`);
    }

    once(event: String, handler: Function) {
        this._listeners.has(event) && this.off(event);
        let listener = RCTDeviceEventEmitter.once(
            event,
            (...data) => {
                handler(...data);
                this._listeners.delete(event);
                console.log(`${event} once event removed by emit.`);
            }
        );
        this._listeners.set(event, [listener]);
    }

    off(...events) {
        for (let event of events) {
            this._off(event);
        }
    }

    _off(event) {
        if ( this._listeners.has(event) ) {
            let olds = this._listeners.get(event);
            //if ( Array.isArray(olds) ) {
                olds.forEach(old => old.remove());
            //} else {
            //    olds.remove();
            //}
            this._listeners.delete(event);
            console.log(`${event} event removed.`);
        }
    }

    emit(event, ...data) {
        if ( this._listeners.has(event) ) {
            RCTDeviceEventEmitter.emit(event, ...data);
        }
    }
}