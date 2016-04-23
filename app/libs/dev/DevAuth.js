/**
 * Created by Layman(http://github.com/anysome) on 16/2/20.
 */
'use strict';

import Device from '../airloy/Device';
import Auth from '../airloy/Auth';
import Xor from './Xor';
import md5 from 'md5';
import base64 from 'base-64';

let _loginTime = 0,
  _device = Device.getIdentifier(),
  _auth = '';


export default class DevAuth extends Auth {

  constructor(args) {
    super(args);
    let secret = args.secret || 'etd|dev';
    let keys = secret.split('|');
    this._key1 = keys[0];
    this._key2 = keys[1];
    this._store = args.store;
    // dev only get device id from store
    this._init();
  }

  async _init() {
    let deviceId = await this._store.getItem('app.device.id');
    if (deviceId) {
      _device = deviceId;
    } else {
      this._store.setItem('app.device.id', _device);
    }
  }

  formUser(account, password) {
    _loginTime = new Date().getTime();
    return {
      account: account,
      password: password,
      device: _device,
      loginTime: _loginTime
    };
  }

  saveUser(sUser) {
    this._session = sUser.session;
    this._passport = sUser.passport;
    this._address = sUser.address;
    _auth = this._makeAuth();
    this._savePassport();
    this._store.setItem('user.lastlogin', '' + _loginTime);
    console.log('----------- passport ------------ ' + this._passport);
    this.user = {
      id: sUser.id,
      name: sUser.name,
      email: sUser.email,
      uid: sUser.uid,
      accountType: sUser.accountType,
      recruit: sUser.recruit
    };
    this._store.setItem('user.info', JSON.stringify(this.user));
    this._store.setItem('user.logined', '1');
    this._logined = true;
    return this.user;
  }

  authRequest(request) {
    request.headers.set('Client-Key', this._client);
    request.headers.set('Auth', _auth);
    if (this._session)
      request.headers.set('Session', this._session);
  }

  update(session, address, passport) {
    session && (this._session = session);
    address && (this._address = address);
    if (passport) {
      this._passport = passport;
      this._savePassport();
    }
    _auth = this._makeAuth();
  }

  async setup() {
    this._logined = '1' === await this._store.getItem('user.logined');
    if (this._logined) {
      _loginTime = await this._store.getItem('user.lastlogin');
      this._passport = await this._store.getItem('user.passport');
      console.log('----------- passport ------------ ' + this._passport);
      console.log('---- key = ' + _loginTime);
      _auth = this._makeAuth();
      //console.debug("------------------------ auth = " + _auth);
      let str = await this._store.getItem('user.info') || '{}';
      console.log('---- user = ' + str);
      this.user = JSON.parse(str);
    }
    return this._logined;
  }

  async updateUser(user) {
    this.user = user;
    this._store.setItem('user.info', JSON.stringify(this.user));
  }

  revoke() {
    console.log('----- revoke passport ------------ ' + this._passport);
    this._passport = '';
    this._savePassport();
    this._store.setItem('user.logined', '0');
    this._store.setItem('user.info', '{}');
    this.user = {};
    this._logined = false;
  }

  _makeAuth() {
    let str = this._address + '`' + _device;
    let key = md5(this._key1 + _loginTime + this._key2);
    str = Xor.encode(str, key);
    let b64 = this._passport + ':' + str;
    b64 = base64.encode(b64);
    return encodeURIComponent(b64);
  }

  _savePassport() {
    this._store.setItem('user.passport', this._passport);
  }
}

