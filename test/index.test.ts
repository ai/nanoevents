import { deepStrictEqual, doesNotThrow, equal } from 'node:assert'
import { test } from 'node:test'

import { createNanoEvents } from '../index.js'

test('is empty from the beginning', () => {
  let ee = createNanoEvents()
  deepStrictEqual(ee.events, {})
})

test('adds listeners', () => {
  let ee = createNanoEvents()

  ee.on('one', () => true)
  ee.on('two', () => true)
  ee.on('two', () => true)

  deepStrictEqual(Object.keys(ee.events), ['one', 'two'])
  equal(ee.events.one?.length, 1)
  equal(ee.events.two?.length, 2)
})

test('calls listener', () => {
  let ee = createNanoEvents()
  let calls: number[][] = []
  ee.on('event', (...args) => {
    calls.push(args)
  })

  ee.emit('event')
  ee.emit('event', 11)
  ee.emit('event', 21, 22)
  ee.emit('event', 31, 32, 33)
  ee.emit('event', 41, 42, 43, 44)

  deepStrictEqual(calls, [[], [11], [21, 22], [31, 32, 33], [41, 42, 43, 44]])
})

test('unbinds listener', () => {
  let ee = createNanoEvents()

  let calls1: number[] = []
  let unbind = ee.on('event', a => {
    calls1.push(a)
  })

  let calls2: number[] = []
  ee.on('event', a => {
    calls2.push(a)
  })

  ee.emit('event', 1)
  unbind()
  ee.emit('event', 2)

  deepStrictEqual(calls1, [1])
  deepStrictEqual(calls2, [1, 2])
})

test('calls unbind after cleaning events', () => {
  let ee = createNanoEvents()
  let unbind = ee.on('event', () => undefined)
  ee.events = {}
  doesNotThrow(() => {
    unbind()
  })
})

test('removes event on no listeners', () => {
  let ee = createNanoEvents()
  let unbind1 = ee.on('one', () => {})
  let unbind2 = ee.on('one', () => {})

  unbind1()
  equal(ee.events.one?.length, 1)

  unbind1()
  equal(ee.events.one?.length, 1)

  unbind2()
  equal(ee.events.one?.length, 0)

  unbind2()
  equal(ee.events.one?.length, 0)
})

test('removes listener during event', () => {
  let ee = createNanoEvents()

  let calls: number[] = []
  let remove1 = ee.on('event', () => {
    remove1()
    calls.push(1)
  })
  ee.on('event', () => {
    calls.push(2)
  })

  ee.emit('event')
  deepStrictEqual(calls, [1, 2])
})

test('allows to use arrow function to bind a context', () => {
  let ee = createNanoEvents()
  let app = {
    check: ['a'],

    getListener() {
      return () => {
        this.check = this.value.split('')
      }
    },

    value: 'test'
  }

  let unbind = ee.on('event', app.getListener())

  doesNotThrow(() => {
    ee.emit('event')
  })

  deepStrictEqual(app.check, ['t', 'e', 's', 't'])

  unbind()
})

test('allows to replace listeners', () => {
  let ee1 = createNanoEvents()
  let ee2 = createNanoEvents()

  let aCalls = 0
  ee1.on('A', () => {
    aCalls += 1
  })
  let bCalls = 0
  ee2.on('B', () => {
    bCalls += 1
  })

  ee1.events = ee2.events

  ee1.emit('A')
  equal(aCalls, 0)

  ee1.emit('B')
  equal(bCalls, 1)
})
