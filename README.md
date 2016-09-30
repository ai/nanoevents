# Nano Events

Small and simple events API.

* No node.js [EventEmitter] compatibility.
* Only 921 bytes after Uglify.
* `on` and `once` methods return `unbind` function. You don’t need to save
  callback to variable for `removeListener`.
* No aliases, just `emit`, `on`, `once` methods.

```js
import NanoEvents from 'nanoevents'
const emitter = new NanoEvents()

const unbind = emitter.on('tick', volume => {
  summary += volume
})
emitter.once('tick', () => {
  works = true
})

function disable () {
  unbind()
}
```

<a href="https://evilmartians.com/?utm_source=nanoevents">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>

## Usage

### Mixing to Object

Because main Nano Events API has only 2 methods,
you could just create proxy methods in your class:

```js
class Ticker {
  constructor() {
    this.emitter = new NanoEvents()
  }
  on() {
    return this.emitter.on.apply(this.events, arguments)
  }
  once() {
    return this.emitter.once.apply(this.events, arguments)
  }
  tick() {
    this.emitter.emit('tick')
  }
}
```

### Add Listener

There are 2 methods to add listener for specific event:
`on` and one-time `once`.

```js
emitter.on('tick', number => {
  console.log('on ' + number)
})
emitter.once('tick', number => {
  console.log('once ' + number)
})

emitter.emit('tick', 1)
// Prints "on 1" and "once 1"
emitter.emit('tick', 2)
// Prints "on 2"
```

### Remove Listener

Methods `on` and `once` return `unbind` function. Call it and this listener
will be removed from event.

```js
const unbind = emitter.on('tick', number => {
  console.log('on ' + number)
})

emitter.emit('tick', 1)
// Prints "on 1"

unbind()
emitter.emit('tick', 2)
// Prints nothing
```

### Execute Listeners

Method `emit` will execute all listeners. First argument is event name, others
will be passed to listeners.

```js
emitter.on('tick', (a, b) => {
  console.log(a, b)
})
emitter.emit('tick', 1, 'one')
// Prints 1, 'one'
```

### Events List

You can get used events list by `events` property.

```js
const unbind = emitter.on('tick', () => { })
Object.keys(emitter.events) //=> ["tick"]

unbind()
Object.keys(emitter.events) //=> []
```

[EventEmitter]: https://nodejs.org/api/events.html
