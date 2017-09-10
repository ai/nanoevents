var NanoEvents = require('../')
var unbindAll = require('../unbind-all')

it('cleans all listeners', function () {
  var ee = new NanoEvents()
  var calls = 0
  ee.on('event', function () {
    calls += 1
  })

  unbindAll(ee)

  ee.emit('event')
  expect(calls).toEqual(0)
})
