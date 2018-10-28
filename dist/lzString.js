(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.LZString = factory());
}(this, (function () { 'use strict';

    var f = String.fromCharCode;

    function _hasOwn(ob, key) {
      return Object.prototype.hasOwnProperty.call(ob, key);
    }

    function _updateContext(context, bitsPerChar, getCharFromInt) {
      if (_hasOwn(context.context_dictionaryToCreate, context.context_w)) {
        if (context.context_w.charCodeAt(0) < 256) {
          for (var i = 0; i < context.context_numBits; i++) {
            context.context_data_val = context.context_data_val << 1;

            if (context.context_data_position == bitsPerChar - 1) {
              context.context_data_position = 0;
              context.context_data.push(getCharFromInt(context.context_data_val));
              context.context_data_val = 0;
            } else {
              context.context_data_position++;
            }
          }

          context.value = context.context_w.charCodeAt(0);

          for (var _i = 0; _i < 8; _i++) {
            context.context_data_val = context.context_data_val << 1 | context.value & 1;

            if (context.context_data_position == bitsPerChar - 1) {
              context.context_data_position = 0;
              context.context_data.push(getCharFromInt(context.context_data_val));
              context.context_data_val = 0;
            } else {
              context.context_data_position++;
            }

            context.value = context.value >> 1;
          }
        } else {
          context.value = 1;

          for (var _i2 = 0; _i2 < context.context_numBits; _i2++) {
            context.context_data_val = context.context_data_val << 1 | context.value;

            if (context.context_data_position == bitsPerChar - 1) {
              context.context_data_position = 0;
              context.context_data.push(getCharFromInt(context.context_data_val));
              context.context_data_val = 0;
            } else {
              context.context_data_position++;
            }

            context.value = 0;
          }

          context.value = context.context_w.charCodeAt(0);

          for (var _i3 = 0; _i3 < 16; _i3++) {
            context.context_data_val = context.context_data_val << 1 | context.value & 1;

            if (context.context_data_position == bitsPerChar - 1) {
              context.context_data_position = 0;
              context.context_data.push(getCharFromInt(context.context_data_val));
              context.context_data_val = 0;
            } else {
              context.context_data_position++;
            }

            context.value = context.value >> 1;
          }
        }

        context.context_enlargeIn--;

        if (context.context_enlargeIn == 0) {
          context.context_enlargeIn = Math.pow(2, context.context_numBits);
          context.context_numBits++;
        }

        delete context.context_dictionaryToCreate[context.context_w];
      } else {
        context.value = context.context_dictionary[context.context_w];

        for (var _i4 = 0; _i4 < context.context_numBits; _i4++) {
          context.context_data_val = context.context_data_val << 1 | context.value & 1;

          if (context.context_data_position == bitsPerChar - 1) {
            context.context_data_position = 0;
            context.context_data.push(getCharFromInt(context.context_data_val));
            context.context_data_val = 0;
          } else {
            context.context_data_position++;
          }

          context.value = context.value >> 1;
        }
      }

      context.context_enlargeIn--;

      if (context.context_enlargeIn == 0) {
        context.context_enlargeIn = Math.pow(2, context.context_numBits);
        context.context_numBits++;
      }
    }

    function compress() {
      var uncompressed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var bitsPerChar = arguments.length > 1 ? arguments[1] : undefined;
      var getCharFromInt = arguments.length > 2 ? arguments[2] : undefined;

      if (uncompressed === null) {
        return '';
      }

      var context = {
        context_dictionary: {},
        context_dictionaryToCreate: {},
        context_data: [],
        context_c: "",
        context_wc: "",
        context_w: "",
        context_enlargeIn: 2,
        context_dictSize: 3,
        context_numBits: 2,
        context_data_val: 0,
        context_data_position: 0
      };
      var i = 0;

      for (var ii = 0; ii < uncompressed.length; ii += 1) {
        context.context_c = uncompressed.charAt(ii);

        if (!_hasOwn(context.context_dictionary, context.context_c)) {
          context.context_dictionary[context.context_c] = context.context_dictSize++;
          context.context_dictionaryToCreate[context.context_c] = true;
        }

        context.context_wc = context.context_w + context.context_c;

        if (_hasOwn(context.context_dictionary, context.context_wc)) {
          context.context_w = context.context_wc;
        } else {
          _updateContext(context, bitsPerChar, getCharFromInt);

          context.context_dictionary[context.context_wc] = context.context_dictSize++;
          context.context_w = String(context.context_c);
        }
      }

      if (context.context_w !== "") {
        _updateContext(context, bitsPerChar, getCharFromInt);
      }

      context.value = 2;

      for (i = 0; i < context.context_numBits; i++) {
        context.context_data_val = context.context_data_val << 1 | context.value & 1;

        if (context.context_data_position == bitsPerChar - 1) {
          context.context_data_position = 0;
          context.context_data.push(getCharFromInt(context.context_data_val));
          context.context_data_val = 0;
        } else {
          context.context_data_position++;
        }

        context.value = context.value >> 1;
      } // Flush the last char


      while (true) {
        context.context_data_val = context.context_data_val << 1;

        if (context.context_data_position == bitsPerChar - 1) {
          context.context_data.push(getCharFromInt(context.context_data_val));
          break;
        } else context.context_data_position++;
      }

      return context.context_data.join('');
    }

    function compressImpl() {
      var uncompressed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (uncompressed === null) {
        return '';
      }

      return compress(uncompressed, 16, function (a) {
        return f(a);
      });
    }

    function decompress(length, resetValue, getNextValue) {
      var dictionary = [];
      var data = {
        val: getNextValue(0),
        position: resetValue,
        index: 1
      };
      var result = [];
      var next;
      var enlargeIn = 4;
      var dictSize = 4;
      var numBits = 3;
      var entry = "";
      var w;
      var resb;
      var c;

      for (var i = 0; i < 3; i += 1) {
        dictionary[i] = i;
      }

      var bits = 0;
      var maxpower = Math.pow(2, 2);
      var power = 1;

      while (power !== maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;

        if (data.position === 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }

        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }

      next = bits;

      switch (next) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2, 8);
          power = 1;

          while (power !== maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;

            if (data.position === 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }

            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }

          c = f(bits);
          break;

        case 1:
          bits = 0;
          maxpower = Math.pow(2, 16);
          power = 1;

          while (power !== maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;

            if (data.position === 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }

            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }

          c = f(bits);
          break;

        case 2:
          return "";
      }

      dictionary[3] = c;
      w = c;
      result.push(c);

      while (true) {
        if (data.index > length) {
          return "";
        }

        bits = 0;
        maxpower = Math.pow(2, numBits);
        power = 1;

        while (power !== maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;

          if (data.position === 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }

          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }

        switch (c = bits) {
          case 0:
            bits = 0;
            maxpower = Math.pow(2, 8);
            power = 1;

            while (power !== maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;

              if (data.position === 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }

              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }

            dictionary[dictSize++] = f(bits);
            c = dictSize - 1;
            enlargeIn--;
            break;

          case 1:
            bits = 0;
            maxpower = Math.pow(2, 16);
            power = 1;

            while (power !== maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;

              if (data.position === 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }

              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }

            dictionary[dictSize++] = f(bits);
            c = dictSize - 1;
            enlargeIn--;
            break;

          case 2:
            return result.join('');
        }

        if (enlargeIn === 0) {
          enlargeIn = Math.pow(2, numBits);
          numBits++;
        }

        if (dictionary[c]) {
          entry = dictionary[c];
        } else {
          if (c === dictSize) {
            entry = w + w.charAt(0);
          } else {
            return null;
          }
        }

        result.push(entry);
        dictionary[dictSize++] = w + entry.charAt(0);
        enlargeIn--;
        w = entry;

        if (enlargeIn === 0) {
          enlargeIn = Math.pow(2, numBits);
          numBits++;
        }
      }
    }

    function decompressImpl() {
      var compressed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (compressed === null) {
        return '';
      }

      if (compressed === '') {
        return null;
      }

      return decompress(compressed, 32768, function (index) {
        return compressed.charCodeAt(index);
      });
    }

    var baseReverseDic = {};
    function getBaseValue(alphabet, character) {
      if (!baseReverseDic[alphabet]) {
        baseReverseDic[alphabet] = {};

        for (var i = 0; i < alphabet.length; i++) {
          baseReverseDic[alphabet][alphabet.charAt(i)] = i;
        }
      }

      return baseReverseDic[alphabet][character];
    }

    var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    function toBase64() {
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

      if (input === null) {
        return "";
      }

      var res = compress(input, 6, function (a) {
        return keyStrBase64.charAt(a);
      });

      switch (res.length % 3) {
        default:
        case 0:
          return res;

        case 1:
          return "".concat(res, "==");

        case 2:
          return "".concat(res, "=");
      }
    }
    function fromBase64() {
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

      if (input === null) {
        return "";
      }

      if (input === "") {
        return null;
      }

      return decompress(input.length, 32, function (index) {
        return getBaseValue(keyStrBase64, input.charAt(index));
      });
    }

    function toUTF16() {
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (input === null) {
        return '';
      }

      return compress(input, 15, function (a) {
        return f(a + 32);
      }) + ' ';
    }
    function fromUTF16() {
      var compressed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (compress === null) {
        return '';
      }

      if (compress === '') {
        return null;
      }

      return decompress(compressed.length, 16384, function (index) {
        return compressed.charCodeAt(index) - 32;
      });
    }

    function toUint8Array(uncompressed) {
      var compressed = compressImpl(uncompressed);
      var buf = new Uint16Array(compressed.length * 2);

      for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
        var current_value = compressed.charCodeAt(i);
        buf[i * 2] = current_value >>> 8;
        buf[i * 2 + 1] = current_value % 256;
      }

      return buf;
    }
    function fromUint8Array(compressed) {
      if (compressed == null) {
        return decompressImpl(compressed);
      }

      var buf = new Array(compressed.length / 2);

      for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
        buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
      }

      var result = [];
      buf.forEach(function (c) {
        result.push(f(c));
      });
      return decompressImpl(result.join(''));
    }

    var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    function toEncodedURIComponent() {
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (input === null) {
        return '';
      }

      return compress(input, 6, function (a) {
        return keyStrUriSafe.charAt(a);
      });
    }
    function fromEncodedURIComponent() {
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (input === null) {
        return '';
      }

      if (input === '') {
        return null;
      }

      input = input.replace(/\s/g, "+");
      return decompress(input.length, 32, function (index) {
        return getBaseValue(keyStrUriSafe, input.charAt(index));
      });
    }

    var LZString = {
      compressToBase64: toBase64,
      decompressFromBase64: fromBase64,
      compressToUTF16: toUTF16,
      decompressFromUTF16: fromUTF16,
      compressToEncodedURIComponent: toEncodedURIComponent,
      decompressFromEncodedURIComponent: fromEncodedURIComponent,
      compressToUint8Array: toUint8Array,
      decompressFromUint8Array: fromUint8Array,
      compress: compressImpl,
      decompress: decompressImpl
    };

    return LZString;

})));
//# sourceMappingURL=lzString.js.map
