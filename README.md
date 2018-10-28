# lzString

LZ-based compression algorithm for JavaScript.

<b>Note:</b> This is a forked library of <a href="http://pieroxy.net/blog/pages/lz-string/index.html">Pieroxy's</a> lz-string library.

The library works in the same manner as <a href="http://pieroxy.net/blog/pages/lz-string/index.html">Pieroxy's</a> lz-string, except that this is a UMD build. The original library supported cjs, angular and requirejs. This on the other hand does not support angular. If you want to use it with angular, please continue reading below or click on the link above to download the original library instead.

This library comes with bug fixes which are not part of original library yet. If you still find any issues please feel free to log them.

# install
```shell
$ npm install -g @scssyworks/lzstring
```

cjs:

```js
const LZString = require('@scssyworks/lzstring');
```

es6:

```js
import LZString from '@scssyworks/lzstring';
```

es5:

```html
<script src="lzString.min.js"></script>
<script>
LZString.compress('Hello World');
</script>
```

angular 1:

```js
angular.module('LZString', []).factory('LZString', () => LZString);
```

# Usage

Compress:

```js
LZString.compress('Hello World'); // Output: 〶惶@✰ӈ
```

De-compress:

```js
LZstring.decompress('〶惶@✰ӈ'); // Output: Hello World
```

Local Storage friendly:

```js
LZString.compressToUTF16('Hello World'); // Output: ɢ䰭䰾怤ݴ䂼怩䠠 
```

De-compress:

```js
LZstring.decompressFromUTF16('ɢ䰭䰾怤ݴ䂼怩䠠 '); // Output: Hello World
```

For more details on available methods, please refer to the original documentation.
