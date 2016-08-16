/**
 * Created by Layman(http://github.com/anysome) on 16/2/20.
 */
import {Platform, AsyncStorage} from 'react-native';
import uuid from 'uuid';

export default class Device {

  constructor(args) {
    this._device_id = null;
    this._init();
  }

  async _init() {
    let deviceId = await await AsyncStorage.getItem('airloy.device.id');
    if (deviceId) {
      this._device_id = deviceId;
    } else {
      this._device_id = Platform.OS + '^react-native^' + uuid.v1();
      this._store.setItem('airloy.device.id', this._device_id);
    }
  }

  getIdentifier() {
    return this._device_id;
  }
}
