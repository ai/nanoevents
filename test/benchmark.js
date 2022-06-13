#!/usr/bin/env node

import benchmark from 'benchmark'

import { createNanoEvents } from '../index.js'

let suite = new benchmark.Suite()

function formatNumber(number) {
  return String(number)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

let counter = 0
let events = createNanoEvents()
events.on('increase', add => {
  counter += add
})

suite
  .add('emit', () => {
    events.emit('increase', 1)
  })
  .add('on', () => {
    let unbind = events.on('print', () => {
      process.stdout.write(counter)
    })
    unbind()
  })
  .on('cycle', event => {
    let name = event.target.name.padEnd('emit  '.length)
    let hz = formatNumber(event.target.hz.toFixed(0)).padStart(9)
    process.stdout.write(`${name}${hz} ops/sec\n`)
  })
  .on('error', event => {
    process.stderr.write(event.target.error.toString() + '\n')
    process.exit(1)
  })
  .run()
