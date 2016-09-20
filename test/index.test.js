var EventEmitter5 = require('../')

it('is a class', function () {
  var instance = new EventEmitter5()
  expect(typeof EventEmitter5).toEqual('function')
  expect(instance instanceof EventEmitter5).toBeTruthy()
})
