var EventEmitter5 = require('../')

it('is a class', function () {
  var ee = new EventEmitter5()
  expect(typeof EventEmitter5).toEqual('function')
  expect(ee instanceof EventEmitter5).toBeTruthy()
})

it('is empty from the beggining', function () {
  var ee = new EventEmitter5()
  expect(ee.listeners).toEqual({ })
})

it('adds listeners', function () {
  var ee = new EventEmitter5()

  ee.on('one', function () { })
  ee.on('two', function () { })
  ee.once('two', function () { })

  expect(Object.keys(ee.listeners)).toEqual(['one', 'two'])
  expect(ee.listeners.one.length).toEqual(1)
  expect(ee.listeners.two.length).toEqual(2)
})

it('calls listener', function () {
  var ee = new EventEmitter5()
  var calls = []
  ee.on('event', function () {
    calls.push(Array.prototype.slice.call(arguments))
  })

  ee.emit('event')
  ee.emit('event', 11)
  ee.emit('event', 21, 22)
  ee.emit('event', 31, 32, 33)
  ee.emit('event', 41, 42, 43, 44)

  expect(calls).toEqual([[], [11], [21, 22], [31, 32, 33], [41, 42, 43, 44]])
})

it('unbinds listener', function () {
  var ee = new EventEmitter5()

  var calls1 = []
  var unbind = ee.on('event', function (a) {
    calls1.push(a)
  })

  var calls2 = []
  ee.on('event', function (a) {
    calls2.push(a)
  })

  ee.emit('event', 1)
  unbind()
  ee.emit('event', 2)

  expect(calls1).toEqual([1])
  expect(calls2).toEqual([1, 2])
})

it('does not fall on multiple unbind', function () {
  var ee = new EventEmitter5()
  var unbind = ee.on('event', function () { })
  unbind()
  unbind()
})

it('calls listener once on request', function () {
  var ee = new EventEmitter5()
  var calls = []
  ee.once('event', function (a) {
    calls.push(a)
  })

  ee.emit('event', 1)
  ee.emit('event', 2)

  expect(calls).toEqual([1])
})

it('calls event manually', function () {
  var ee = new EventEmitter5()

  var calls1 = []
  ee.on('event', function (a) {
    calls1.push(a)
  })

  var calls2 = []
  ee.on('event', function (a) {
    calls2.push(a)
  })

  ee.call(ee.listeners.event[0], 1)

  expect(calls1).toEqual([1])
  expect(calls2).toEqual([])
})

it('removes once listener on manually call', function () {
  var ee = new EventEmitter5()
  var calls = []
  ee.once('event', function (a) {
    calls.push(a)
  })

  ee.call(ee.listeners.event[0], 1)

  expect(calls).toEqual([1])
  expect(ee.listeners.event.length).toEqual(0)
})
