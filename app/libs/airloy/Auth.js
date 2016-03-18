/**
 * Created by Layman(http://github.com/anysome) on 16/2/20.
 */
'use strict';

export default class Auth {

    constructor(args) {
        // ios archive error
        //if (new.target === Auth) {
        //    throw new Error('Cannot instantiate an abstract class');
        //}
        this._client = args.client;
        this._event = args.event;
        this._passport = '11111111-1111-1111-1111-111111111111';
        this._session = '00000000-1111-1111-1111-111111111111';
        this._address = '127.0.0.1';
        this._logined = false;
        this.user = {};
    }

    formUser(account, password) {
        return {
            account: account,
            password: password
        };
    }

    async saveUser(sUser) {
        this.user = {
            id: sUser.id,
            name: sUser.name,
            email: sUser.email,
            accountType: sUser.accountType,
            recruit: sUser.recruit
        };
        return this.user;
    }

    getUser() {
        return this.user;
    }

    authRequest(request) {
        request.headers.set('Client-Key', this._client);
        request.headers.set('Session', this._session);
    }

    update(session, address, passport) {
        session && (this._session = session);
        address && (this._address = address);
        passport && (this._passport = passport);
    }

    async setup() {
        return true;
    }

    logined() {
        return this._logined;
    }

    logout() {
        this.revoke();
        this._event.emit(this._event.logoutEvent);
    }

    revoke() {

    }

}