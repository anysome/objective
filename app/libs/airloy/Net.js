/**
 * Created by Layman(http://github.com/anysome) on 16/2/20.
 */


export default class Net {

  constructor(args) {
    this._server = 'http://localhost/';
    this._auth = args.auth;
    this._event = args.event;
  }

  config(args) {
    let server = this._server;
    if ( args.server ) {
      server = (args.https ? 'https://' : 'http://') + args.server + '/';
    }
    this._server = server;
    args.auth && (this._auth = args.auth);
    args.event && (this._event = args.event);
  }

  _fullUrl(url) {
    if (url.substr(0, 4) === 'http') {
      return url;
    } else {
      return this._server + url;
    }
  }

  _queryString(obj) {
    if (!obj) return '';
    var pairs = [], values;

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        Array.isArray(values = obj[prop]) || (values = [values]);
        prop = prop + "=";
        for (var i = 0; i < values.length; i++) {
          pairs.push(prop + encodeURIComponent(values[i]));
        }
      }
    }
    return pairs.join("&");
  }

  async _responseHandle(response) {
    switch (response.status) {
      case 201:
        this._auth.update(response.headers.get('Session'), response.headers.get('Address'));
      case 200:
        return await response.json();
      case 400:
        return {
          success: false,
          message: "error.request.param",
          info: response.status
        };
      case 401:
        this._event.emit(this._event.authRequiredEvent);
        return {
          success: false,
          message: "error.request.auth",
          info: response.status
        };
      case 0:
        return {
          success: false,
          message: "error.network.offline",
          info: response.status
        };
      default:
        return {
          success: false,
          message: "error.network.server",
          info: response.status
        };
    }
  }

  async httpGet(url, data) {
    try {
      let params = data ? '?' + this._queryString(data) : '';
      let request = new Request(this._fullUrl(url) + params, {
        method: 'GET',
        headers: new Headers({
          Accept: 'application/json;charset=UTF-8'
        })
      });
      this._auth.authRequest(request);
      let response = await fetch(request);
      return await this._responseHandle(response);
    } catch (e) {
      console.warn('http result parsing failed', JSON.stringify(e));
      return {
        success: false,
        message: e.message,
        info: e.status
      };
    }

  }

  async httpPost(url, data) {
    try {
      let request = new Request(this._fullUrl(url), {
        method: 'POST',
        headers: new Headers({
          'Accept': 'application/json;charset=UTF-8',
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(data)
      });
      this._auth.authRequest(request);
      let response = await fetch(request);
      return await this._responseHandle(response);
    } catch (e) {
      console.warn('http result parsing failed', JSON.stringify(e));
      return {
        success: false,
        message: e.message,
        info: e.status
      };
    }
  }
}
