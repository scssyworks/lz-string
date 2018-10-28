import compress from './compress';
import decompress from './decompress';
import { getBaseValue } from './getBaseValue';

const keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";

export function toEncodedURIComponent(input = '') {
    if (input === null) {
        return '';
    }
    return compress(input, 6, (a) => keyStrUriSafe.charAt(a));
}

export function fromEncodedURIComponent(input = '') {
    if (input === null) {
        return '';
    }
    if (input === '') {
        return null;
    }
    input = input.replace(/\s/g, "+");
    return decompress(input.length, 32, (index) => getBaseValue(keyStrUriSafe, input.charAt(index)));
}