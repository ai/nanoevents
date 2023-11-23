# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## 9.0
* Dropped Node.js 16 support.
* Reduced size (by @igisev).

## 8.0
* Dropped Node.js 14 support.
* Fixed types (by @jakub791).

## 7.0.1
* Reduced size.

## 7.0
* Improved performance (by Sergey Ukustov).
* Dropped Node.js 12 support.

## 6.0.2
* Reduced npm package size.

## 6.0.1
* Fixed `package.json` export (by Jules Robichaud-Gagnon).

## 6.0
* Moved project to ESM-only type. Applications must use ESM too.
* Dropped Node.js 10 support.

## 5.1.13
* Added `default` to `package.exports`.

## 5.1.12
* Reduced npm package size.

## 5.1.11
* Fixed unsubscribing on cleaned `Emitter#events` (by Mikhail Nasyrov).

## 5.1.10
* Fixed `package.types` path.

## 5.1.9
* Added `package.types`.

## 5.1.8
* Fix ES module support.

## 5.1.7
* Simplify `Emitter` type usage.

## 5.1.6
* Clean up code.

## 5.1.5
* Fix ES module regression.

## 5.1.4
* Remove React Native extra files.

## 5.1.3
* Allow to use library in React Native without `resolverMainFields`.

## 5.1.2
* Fix React Native warnings.

## 5.1.1
* Add temporary workaround for React Native.

## 5.1
* Add `Unsubscribe` type.

## 5.0.1
* Mark package to be free from side effects.
* Clean up types (by Bogdan Chadkin).

## 5.0
* Use named export instead of default export.

## 4.0.3
* Add `this` type definition (by Anton Khlynovskiy).
* Improve docs (by @azu and @38elements).

## 4.0.2
* Improve `emit` performance.

## 4.0.1
* Reduce size (by Eduardo San Martin Morote).

## 4.0
* Use `index.js` instead of `index.mjs` for ES modules.

## 3.0
* Use modern JS syntax and drop IE 11 support.
* Remove `nanoevents/unbind-all` helper.
* Add `NanoEvents#set`.
* Add TypeScript definitions.
* Add ES modules support.
* Reduce size.

## 2.0
* Remove `this` from listeners to bind it explicitly (by Alexander Zonov).

## 1.0.8
* Reduce size (by Vladlen Grachev).

## 1.0.7
* Reduce size (by Vladlen Grachev).

## 1.0.6
* Fix docs.

## 1.0.5
* Reduce npm package size.

## 1.0.4
* Reduce npm package size.

## 1.0.3
* Reduce npm package size.

## 1.0.2
* Reduce size (by Anton Khlynovskiy).

## 1.0.1
* Reduce size (by Anton Khlynovskiy).

## 1.0
* Remove `NanoEvents#once` method.
* `NanoEvents#emit` doesn’t return boolean anymore.
* Check arguments types only in development.
* Reduce size.

## 0.4.1
* Fix clashing with `Object` methods (by Anton Khlynovskiy).
* Reduce size (by Anton Khlynovskiy).

## 0.4
* Add `nanoevents/unbind-all` helper (by Igor Deryabin).
* Fix JSDoc (by Igor Deryabin).
* Reduce size.

## 0.3
* Allow to change listeners during the emit.

## 0.2
* Throw a error on non-function listener.

## 0.1
* Initial release.
