# Nano Events

Simple and tiny event emitter library for JavaScript.

* Only **72 bytes** (minified and gzipped).
  It uses [Size Limit] to control size.
* `on` method returns `unbind` function. You don’t need to save
  callback to variable for `removeListener`.
* TypeScript and ES modules support.
* No aliases, just `emit` and `on` methods.
  No Node.js [EventEmitter] compatibility.

```js
import { createNanoEvents } from 'nanoevents'

const emitter = createNanoEvents()

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


## Table of Contents

* [Install](#install)
* [TypeScript](#typescript)
* [Mixing to Object](#mixing-to-object)
* [Add Listener](#add-listener)
* [Remove Listener](#remove-listener)
* [Execute Listeners](#execute-listeners)
* [Events List](#events-list)
* [Once](#once)
* [Remove All Listeners](#remove-all-listeners)


## Install

```sh
npm install nanoevents
```


## TypeScript

Nano Events accepts interface with event name
to listener argument types mapping.

```ts
interface Events {
  set: (name: string, count: number) => void,
  tick: () => void
}

const emitter = createNanoEvents<Events>()

// Correct calls:
emitter.emit('set', 'prop', 1)
emitter.emit('tick')

// Compilation errors:
emitter.emit('set', 'prop', '1')
emitter.emit('tick', 2)
```


## Mixing to Object

Because Nano Events API has only just 2 methods,
you could just create proxy methods in your class
or encapsulate them entirely.

```js
class Ticker {
  constructor () {
    this.emitter = createNanoEvents()
    this.internal = setInterval(() => {
      this.emitter.emit('tick')
    }, 100)
  }

  stop () {
    clearInterval(this.internal)
    this.emitter.emit('stop')
  }

  on (event, callback) {
    return this.emitter.on(event, callback)
  }
}
```

With Typescript:

```ts
import { createNanoEvents, Emitter } from "nanoevents"

interface Events {
  start: (startedAt: number) => void
}

class Ticker {
  emitter: Emitter

  constructor () {
    this.emitter = createNanoEvents<Events>()
  }

  on<E extends keyof Events>(event: E, callback: Events[E]) {
    return this.emitter.on(event, callback)
  }
}
```


## Add Listener

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
var app = {
  userId: 1,
  getListener () {
    return () => {
      console.log(this.userId)
    }
  }
}
emitter.on('print', app.getListener())
```

Note: binding with use of the `.bind()` method won’t work as you might expect
and therefore is not recommended.


## Remove Listener

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


## Execute Listeners

Method `emit` will execute all listeners. First argument is event name, others
will be passed to listeners.

```js
emitter.on('tick', (a, b) => {
  console.log(a, b)
})
emitter.emit('tick', 1, 'one')
// Prints 1, 'one'
```


## Events List

You can get used events list by `events` property.

```js
const unbind = emitter.on('tick', () => { })
emitter.events //=> { tick: [ [Function] ] }
```


## Once

If you need add event listener only for first event dispatch,
you can use this snippet:

```js
class Ticker {
  constructor () {
    this.emitter = createNanoEvents()
  }
  …
  once (event, callback) {
    const unbind = this.emitter.on(event, (...args) => {
      unbind()
      callback(...args)
    })
    return unbind
  }
}
```


## Remove All Listeners

```js
emitter.on('event1', () => { })
emitter.on('event2', () => { })

emitter.events = { }
```
