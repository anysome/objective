/**
 * Created by Layman(http://github.com/anysome) on 16/2/20.
 */
'use strict';

export default class Xor {

    static encode(data, key) {
        var temp = [], res = '';
        for(var i=0,j=0; i<data.length; i++,j++) {
            if ( j===key.length ) {
                j = 0;
            }
            temp.push(data.charCodeAt(i) ^ key.charCodeAt(j));
        }
        for (var i=0; i<temp.length; i++) {
            res += String.fromCharCode(temp[i]);
        }
        return res;
    }

    static decode(data, key) {
        return Xor.encode(data, key);
    }
}