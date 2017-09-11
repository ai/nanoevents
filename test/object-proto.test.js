var NanoEvents = require('../')

it('does not clash with Object.prototype properties', function () {
  var ee = new NanoEvents()
  expect(function () {
    ee.emit('constructor')
    ee.emit('hasOwnProperty')
    ee.emit('__proto__')
  }).not.toThrowError()
})
