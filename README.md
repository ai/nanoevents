# Nano Events

Simple and tiny event emitter library for JavaScript.

* Only **101 bytes** (minified and gzipped).
  It uses [Size Limit] to control size.
* `on` method returns `unbind` function. You don’t need to save
  callback to variable for `removeListener`.
* No aliases, just `emit` and `on` methods.
  No Node.js [EventEmitter] compatibility.

```js
import NanoEvents from 'nanoevents'
const emitter = new NanoEvents()

const unbind = emitter.on('tick', volume => {
  summary += volume
})

emitter.emit('tick', 2)
summary //=> 2

unbind()
emitter.emit('tick', 2)
summary //=> 2
```

[EventEmitter]: https://nodejs.org/api/events.html
[Size Limit]:   https://github.com/ai/size-limit

<a href="https://evilmartians.com/?utm_source=nanoevents">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>


## Usage

### Mixing to Object

Because Nano Events API has only just 2 methods,
you could just create proxy methods in your class.

```js
class Ticker {
  constructor() {
    this.emitter = new NanoEvents()
  }
  on() {
    return this.emitter.on.apply(this.emitter, arguments)
  }
  tick() {
    this.emitter.emit('tick')
  }
}
```

It allows you to have custom JSDoc or type definitions.


### Add Listener

Use `on` method to add listener for specific event:

```js
emitter.on('tick', number => {
  console.log(number)
})

emitter.emit('tick', 1)
// Prints 1
emitter.emit('tick', 5)
// Prints 5
```

In case of your listener relies on some particular context
(if it uses `this` within itself) you have to bind required
context explicitly before passing function in as a callback.

```js
const app = {
  userId = 1,
  showUserId() {
    console.log(this.userId)
  }
}
emitter.on('print', app.showUserId.bind(app))
```

### Remove Listener

Methods `on` returns `unbind` function. Call it and this listener
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


### Once

If you need add event listener only for first event dispatch,
you can use this snippet:

```js
class Ticker {
  constructor() {
    this.emitter = new NanoEvents()
  }
  …
  once (event, callback) {
    const unbind = this.emitter.on(event, function () {
      unbind()
      callback.apply(this, arguments)
    })
    return unbind
  }
}
```

### Remove all listeners

`unbindAll` method will remove all listeners to all events.

```js
import unbindAll from 'nanoevents/unbind-all';

emitter.on('event1', () => { })
emitter.on('event2', () => { })

unbindAll(emitter);

Object.keys(emitter.events) //=> { }
```
