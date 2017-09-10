var NanoEvents = require('../')
var helpers = require('../helpers')

it('cleans all listeners', function () {
  var ee = new NanoEvents()

  ee.on('event', function () { })

  expect(function () { helpers.unbindAll(null) }).not.toThrow()

  helpers.unbindAll(ee)
  expect(Object.keys(ee.events)).toEqual([])
})
