import { compressImpl as compress } from './compress';
import { decompressImpl as decompress } from './decompress';
import { f } from './fromCharCode';

export function toUint8Array(uncompressed) {
    const compressed = compress(uncompressed);
    const buf = new Uint16Array(compressed.length * 2);
    for (let i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
        var current_value = compressed.charCodeAt(i);
        buf[i * 2] = current_value >>> 8;
        buf[i * 2 + 1] = current_value % 256;
    }
    return buf;
}

export function fromUint8Array(compressed) {
    if (compressed == null) {
        return decompress(compressed);
    }
    const buf = new Array(compressed.length / 2);
    for (let i = 0, TotalLen = buf.length; i < TotalLen; i++) {
        buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
    }

    const result = [];
    buf.forEach(function (c) {
        result.push(f(c));
    });
    return decompress(result.join(''));
}