let NanoEvents = require('../')

it('is a class', () => {
  let ee = new NanoEvents()
  expect(typeof NanoEvents).toEqual('function')
  expect(ee).toBeInstanceOf(NanoEvents)
})

it('is empty from the beggining', () => {
  let ee = new NanoEvents()
  expect(ee.events).toEqual({ })
})

it('allows only function as listener', () => {
  let ee = new NanoEvents()
  expect(() => {
    ee.on('event', { })
  }).toThrow(/function/)
})

it('adds listeners', () => {
  let ee = new NanoEvents()

  ee.on('one', () => true)
  ee.on('two', () => true)
  ee.on('two', () => true)

  expect(Object.keys(ee.events)).toEqual(['one', 'two'])
  expect(ee.events.one).toHaveLength(1)
  expect(ee.events.two).toHaveLength(2)
})

it('calls listener', () => {
  let ee = new NanoEvents()
  let calls = []
  ee.on('event', (...args) => {
    calls.push(args)
  })

  ee.emit('event')
  ee.emit('event', 11)
  ee.emit('event', 21, 22)
  ee.emit('event', 31, 32, 33)
  ee.emit('event', 41, 42, 43, 44)

  expect(calls).toEqual([[], [11], [21, 22], [31, 32, 33], [41, 42, 43, 44]])
})

it('unbinds listener', () => {
  let ee = new NanoEvents()

  let calls1 = []
  let unbind = ee.on('event', a => {
    calls1.push(a)
  })

  let calls2 = []
  ee.on('event', a => {
    calls2.push(a)
  })

  ee.emit('event', 1)
  unbind()
  ee.emit('event', 2)

  expect(calls1).toEqual([1])
  expect(calls2).toEqual([1, 2])
})

it('removes event on no listeners', () => {
  let ee = new NanoEvents()
  let unbind1 = ee.on('one', () => {})
  let unbind2 = ee.on('one', () => {})

  unbind1()
  expect(ee.events.one).toHaveLength(1)

  unbind1()
  expect(ee.events.one).toHaveLength(1)

  unbind2()
  expect(ee.events.one).toHaveLength(0)

  unbind2()
  expect(ee.events.one).toHaveLength(0)
})

it('removes listener during event', () => {
  let ee = new NanoEvents()

  let calls = []
  let remove1 = ee.on('event', () => {
    remove1()
    calls.push(1)
  })
  ee.on('event', () => {
    calls.push(2)
  })

  ee.emit('event')
  expect(calls).toEqual([1, 2])
})

it('does not clash with Object.prototype properties', () => {
  let ee = new NanoEvents()
  expect(() => {
    ee.emit('constructor')
    ee.emit('hasOwnProperty')
    ee.emit('__proto__')
  }).not.toThrow()
})

it('emit applies regular functions to the global object', () => {
  let ee = new NanoEvents()

  global.nanoEventsTestValue = 'value'

  let results = []

  function listener () {
    // eslint-disable-next-line no-invalid-this
    results.push(this.nanoeventsTestValue)
  }

  let unbind1 = ee.on('event', listener)
  let unbind2 = ee.on('event', listener.bind({
    nanoEventsTestValue: 'wrong value'
  }))

  ee.emit('event')

  expect(results).toHaveLength(2)
  expect(results[0] === results[1]).toBe(true)

  unbind1()
  unbind2()
})

it('allows to use arrow function to bind a context', () => {
  let ee = new NanoEvents()
  let app = {
    value: 'test',
    getListener () {
      return () => {
        this.check = this.value.split('')
      }
    }
  }

  let unbind = ee.on('event', app.getListener())

  expect(() => {
    ee.emit('event')
  }).not.toThrow()

  expect(app.check).toEqual(['t', 'e', 's', 't'])

  unbind()
})
