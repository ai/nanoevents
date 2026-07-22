#!/usr/bin/env node

import { Bench } from 'tinybench'

import { createNanoEvents } from '../index.js'

function formatNumber(number) {
  return String(number).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

let counter = 0
let events = createNanoEvents()
events.on('increase', add => {
  counter += add
})

let bench = new Bench()

bench
  .add('emit', () => {
    events.emit('increase', 1)
  })
  .add('on', () => {
    let unbind = events.on('print', () => {})
    unbind()
  })

await bench.run()

for (let task of bench.tasks) {
  let name = task.name.padEnd('emit  '.length)
  let hz = formatNumber(task.result.throughput.mean.toFixed(0)).padStart(9)
  process.stdout.write(`${name}${hz} ops/sec\n`)
}
