let NanoEvents = require('../')
let unbindAll = require('../unbind-all')

it('cleans all listeners', () => {
  let ee = new NanoEvents()
  let calls = 0
  ee.on('event', () => {
    calls += 1
  })

  unbindAll(ee)

  ee.emit('event')
  expect(calls).toEqual(0)
})
