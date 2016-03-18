/**
 * Created by Layman(http://github.com/anysome) on 16/2/20.
 */
'use strict';

import Device from './Device';
import Store from './Store';
import Event from './Event';
import Auth from './Auth';
import Net from './Net';

const store = new Store();
const event = new Event();
let auth = null;
let net = new Net({
    server: 'http://localhost:8080',
    auth: auth,
    event: event
});

let Airloy = {
    device: Device,
    auth: auth,
    store: store,
    event: event,
    net: net
};

export default Airloy;

export function init(MyAuth, config) {
    auth = new MyAuth({
        client: config.clientKey,
        event: event,
        secret: config.clientSecret,
        store: store
    });
    Airloy.auth = auth;
    Airloy.net.config({
        server: config.server,
        auth: auth
    });
}