/**
 * Created by Layman(http://github.com/anysome) on 16/2/20.
 */
'use strict';

import {AsyncStorage} from 'react-native';

export default class Store {

    async getItem(key) {
        var value = await AsyncStorage.getItem(key);
        return value;
    }
    setItem(key, value) {
        AsyncStorage.setItem(key, value);
    }
}