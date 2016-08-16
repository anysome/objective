/**
 * Created by Layman(http://github.com/anysome) on 16/2/20.
 */

import Auth from '../Auth';
import rc4 from './rc4';
import md5 from 'md5';
import base64 from 'base-64';

let _loginTime = 0,
  _auth = '';


export default class Rc4Auth extends Auth {

  constructor(args) {
    super(args);
    this._secret = args.secret || 'airloy.rc4';
    this._store = args.store;
    this._device = args.device;
  }

  formUser(account, password) {
    _loginTime = new Date().getTime();
    return {
      account: account,
      password: password,
      device: this._device.getIdentifier(),
      loginTime: _loginTime
    };
  }

  saveUser(sUser) {
    this._session = sUser.session;
    this._passport = sUser.passport;
    this._address = sUser.address;
    _auth = this._makeAuth();
    this._savePassport();
    this._store.setItem('airloy.user.login.time', '' + _loginTime);
    console.log('----------- passport ------------ ' + this._passport);
    this.user = {
      id: sUser.id,
      name: sUser.name,
      email: sUser.email,
      uid: sUser.uid,
      accountType: sUser.accountType,
      recruit: sUser.recruit,
      avatar: sUser.avatar
    };
    this._store.setItem('airloy.user.info', JSON.stringify(this.user));
    this._store.setItem('airloy.user.login.flag', '1');
    this._logined = true;
    return this.user;
  }

  authRequest(request) {
    request.headers.set('Host', this._host);
    request.headers.set('X-Airloy-App', this._client);
    request.headers.set('X-Airloy-Auth', _auth);
    if (this._session)
      request.headers.set('X-Airloy-Token', this._session);
  }

  update(session, address, passport) {
    console.log('new session = ' + session + ', address = ' + address + ', passport = ' + passport);
    session && (this._session = session);
    address && (this._address = address);
    if (passport) {
      this._passport = passport;
      this._savePassport();
    }
    _auth = this._makeAuth();
  }

  async setup() {
    this._logined = '1' === await this._store.getItem('airloy.user.login.flag');
    if (this._logined) {
      _loginTime = await this._store.getItem('airloy.user.login.time');
      this._passport = await this._store.getItem('airloy.user.passport');
      _auth = this._makeAuth();
      console.log('---- auth = ' + _auth);
      let str = await this._store.getItem('airloy.user.info') || '{}';
      console.log('---- user = ' + str);
      this.user = JSON.parse(str);
    }
    return this._logined;
  }

  async updateUser(user) {
    this.user = user;
    this._store.setItem('airloy.user.info', JSON.stringify(this.user));
  }

  revoke() {
    console.log('----- revoke passport ------------ ' + this._passport);
    this._passport = '';
    this._savePassport();
    this._store.setItem('airloy.user.login.flag', '0');
    this._store.setItem('airloy.user.info', '{}');
    this.user = {};
    this._logined = false;
  }

  _makeAuth() {
    let str = this._address + '`' + this._device.getIdentifier();
    let key = md5(_loginTime + this._secret);
    str = rc4(str, key);
    let b64 = this._passport + ':' + str;
    b64 = base64.encode(b64);
    return encodeURIComponent(b64);
  }

  _savePassport() {
    this._store.setItem('airloy.user.passport', this._passport);
  }
}

