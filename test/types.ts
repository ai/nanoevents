import type { Emitter, EmitterMixin } from '../index.js';
import { createNanoEvents } from '../index.js'

interface Events {
  add: (c: number) => void
  set: (a: string, b: number) => void
  tick: () => void
}

function fn(a: string): void {
  console.log(a)
}

let ee = createNanoEvents<Events>()
ee.on('set', a => {
  fn(a)
})

ee.emit('set', 'a', 1)
ee.emit('add', 2)
ee.emit('tick')

ee.events = {
  set: [
    a => {
      fn(a)
    }
  ]
}

function listenersCount(emitter: Emitter): number {
  let count = 0
  for (let i in emitter.events) {
    count += emitter.events[i]?.length ?? 0
  }
  return count
}

console.log(listenersCount(ee))

type Mixin = {
  add: () => void
} & EmitterMixin<Events>

const createMixin = (): Mixin => {
  let mixinEmitter = createNanoEvents<Events>()

  return {
    add: () => {
      mixinEmitter.emit('add', 1)
    },
    on: mixinEmitter.on.bind(mixinEmitter),
  }
}

const mixin = createMixin()

mixin.on('add', (a) => {
  console.log(a)
})

mixin.add()
