/**
 * Created by Layman(http://github.com/anysome) on 16/2/20.
 */
'use strict';

import DeviceInfo from 'react-native-device-info';

export default class Device {
    static os = DeviceInfo.getSystemName();
    static device_name = DeviceInfo.getDeviceName();
    static device_id = DeviceInfo.getUniqueID();
    static version = DeviceInfo.getVersion();
    static locale = DeviceInfo.getDeviceLocale();

    static getIdentifier() {
        return Device.os + '^' + Device.device_name + '^' + Device.device_id;
    }
}