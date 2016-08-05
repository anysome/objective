/**
 * Created by Layman <anysome@gmail.com> (http://github.com/anysome) on 16/7/18.
 */

export default function rc4(str, key) {
    var s = [], k = [], i = 0, j = 0, x, res = "";
    for ( i = 0; i < 256; i++ ) {
        s[i] = i;
        k[i] = key.charCodeAt( i % key.length );
    }
    for ( i = 0; i < 256; i++ ) {
        j = (j + s[i] + k[i]) % 256;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
    }
    i = 0;
    j = 0;
    for ( var y = 0; y < str.length; y++ ) {
        i = ( i + 1 ) % 256;
        j = ( j + s[i] ) % 256;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
        res += String.fromCharCode( str.charCodeAt( y ) ^ s[( s[i] + s[j] ) % 256]) ;
    }
    return res;
}