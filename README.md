# Nano Events

Small, simple and clean events API.
The differences from many other node.js events APIs:

* No node.js [EventEmitter] compatibility.
* Only 923 bytes after Uglify.
* `on` and `once` methods return `unbind` function. You don’t need to save
  callback to variable for `removeListener`.
* No aliases, just `emit`, `on`, `once` methods.

```js
import NanoEvents from 'nanoevents'
const emitter = new NanoEvents()

const unbind = emitter.on('tick', volume => {
  summery += volume
})
emitter.once('tick', () => {
  works = true
})

function disable () {
  unbind()
}
```

## Usage

### Mixing to Object

Because main Nano Events API is only 2 method, you could just create proxy
in your class:

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

There are 2 method to add listener for specific event: `on` and `once`.
First will create regular listener, second will remove listener after first
execution.

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

Method `on` and `once` return `unbind` function. Call it and this listener
will be unbind from event.

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
