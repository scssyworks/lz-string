import { toBase64 as compressToBase64, fromBase64 as decompressFromBase64 } from './modules/base64';
import { toUTF16 as compressToUTF16, fromUTF16 as decompressFromUTF16 } from './modules/utf16';
import { toUint8Array as compressToUint8Array, fromUint8Array as decompressFromUint8Array } from './modules/uint8array';
import { toEncodedURIComponent as compressToEncodedURIComponent, fromEncodedURIComponent as decompressFromEncodedURIComponent } from './modules/encodedURIComponent';
import { compressImpl as compress } from './modules/compress';
import { decompressImpl as decompress } from './modules/decompress';

const LZString = {
  compressToBase64,
  decompressFromBase64,
  compressToUTF16,
  decompressFromUTF16,
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
  compressToUint8Array,
  decompressFromUint8Array,
  compress,
  decompress
};

export default LZString;