/**
 * Interface for event subscription.
 *
 * @example
 * class Ticker {
 *   constructor() {
 *     this.events = new EventEmitter5()
 *   }
 *   on() {
 *     return this.events.on.apply(this.events, arguments)
 *   }
 *   once() {
 *     return this.events.once.apply(this.events, arguments)
 *   }
 *   tick() {
 *     this.events.emit('tick')
 *   }
 * }
 *
 * @class
 */
function EventEmitter5 () {
  this.listeners = { }
}

function add (emitter, event, callback) {
  var isSubscribed = true
  var listener = { fn: callback }

  listener.rm = function () {
    if (!isSubscribed) return
    isSubscribed = false
    var listeners = emitter.listeners[event]
    listeners.splice(listeners.indexOf(listener), 1)
  }

  if (emitter.listeners[event]) {
    emitter.listeners[event].push(listener)
  } else {
    emitter.listeners[event] = [listener]
  }
  return listener
}

EventEmitter5.prototype = {

  /**
   * Add a listener for a given event.
   *
   * @param {string} event The event name.
   * @param {function} callback The listener function.
   *
   * @return {function} Unbind listener from event
   *
   * @example
   * const unbind = ee.on('tick', (tickType, tickDuration) => {
   *   count += 1
   * })
   *
   * disable () {
   *   unbind()
   * }
   */
  on: function on (event, callback) {
    var listener = add(this, event, callback)
    return listener.rm
  },

  /**
   * Add a one-time listener for a given event.
   *
   * @param {string} event The event name.
   * @param {function} callback The listener function.
   *
   * @return {function} Unbind listener from event
   *
   * @example
   * const unbind = ee.once('tick', (tickType, tickDuration) => {
   *   works = true
   * })
   */
  once: function once (event, callback) {
    var listener = add(this, event, callback)
    listener.once = true
    return listener.rm
  },

  /**
   * Calls each of the listeners registered for a given event.
   *
   * @param {string} event The event name.
   * @param {...*} arguments The arguments to listeners.
   *
   * @returns {boolean} `true` if the event had listeners, else `false`.
   *
   * @example
   * ee.emit('tick', tickType, tickDuration)
   */
  emit: function emit (event, a1, a2, a3, a4, a5, a6) {
    var listeners = this.listeners[event]
    if (!listeners || listeners.length === 0) return false

    var args = arguments
    listeners.forEach(function (i) {
      args[0] = i
      this.call.apply(this, args)
    }, this)

    return true
  },

  /**
   * Execute listener callback.
   *
   * @param {object} listener Listener object
   * @param {...*} arguments The arguments to listeners.
   *
   * @return {*} callback’s result
   *
   * @example
   * for (listener of ee.listeners['tick']) {
   *   if (ee.call(listener, tickType, tickDuration) === false) {
   *     break
   *   }
   * }
   */
  call: function call (listener, a1, a2, a3) {
    if (listener.once) listener.rm()
    switch (arguments.length) {
      case 1:
        listener.fn.call(this)
        break
      case 2:
        listener.fn.call(this, a1)
        break
      case 3:
        listener.fn.call(this, a1, a2)
        break
      default:
        var args = new Array(arguments.length - 1)
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i]
        }
        listener.fn.apply(this, args)
    }
  }

}

module.exports = EventEmitter5
