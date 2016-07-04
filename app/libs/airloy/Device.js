/**
 * Created by Layman(http://github.com/anysome) on 16/2/20.
 */
import {Platform} from 'react-native';
import uuid from 'uuid';

export default class Device {

    static getIdentifier() {
      return Platform.OS + '^react-native^' + uuid.v1();
    }
}
