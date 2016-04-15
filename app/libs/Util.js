/**
 * Created by Layman(http://github.com/anysome) on 16/4/15.
 */

import {Platform} from 'react-native';

export default new class {
    trace(obj) {
        for (var prop in obj) {
            console.log('prop: ' + prop);
        }
    }
    clone(object) {
        return JSON.parse(JSON.stringify(object));
    }
    removeFromArray(arr, item) {
        let index = arr.indexOf(item);
        index > -1 && arr.splice(index, 1);
    }
    isAndroid() {
        return Platform.OS === 'android';
    }
} ();