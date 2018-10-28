import compress from './compress';
import decompress from './decompress';
import { getBaseValue } from './getBaseValue';

const keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

export function toBase64(input = "") {
    if (input === null) {
        return "";
    }
    let res = compress(input, 6, (a) => keyStrBase64.charAt(a));
    switch (res.length % 3) {
        default:
        case 0: return res;
        case 1: return `${res}==`;
        case 2: return `${res}=`;
    }
}

export function fromBase64(input = "") {
    if (input === null) {
        return "";
    }
    if (input === "") {
        return null;
    }
    return decompress(input.length, 32, (index) => getBaseValue(keyStrBase64, input.charAt(index)));
}