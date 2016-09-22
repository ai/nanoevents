/**
 * Interface for event subscription.
 *
 * @example
 * class Ticker {
 *   constructor() {
 *     this.emitter = new NanoEvents()
 *   }
 *   on() {
 *     return this.emitter.on.apply(this.events, arguments)
 *   }
 *   once() {
 *     return this.emitter.once.apply(this.events, arguments)
 *   }
 *   tick() {
 *     this.emitter.emit('tick')
 *   }
 * }
 *
 * @class
 */
function NanoEvents () {
  /**
   * Event names in keys and listeners array in values
   * @type {object}
   */
  this.events = { }
}

function add (emitter, event, callback) {
  var isSubscribed = true
  var listener = { fn: callback }

  listener.rm = function () {
    if (!isSubscribed) return
    isSubscribed = false
    var listeners = emitter.events[event]
    listeners.splice(listeners.indexOf(listener), 1)
  }

  if (emitter.events[event]) {
    emitter.events[event].push(listener)
  } else {
    emitter.events[event] = [listener]
  }
  return listener
}

NanoEvents.prototype = {

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
  emit: function emit (event, a1, a2, a3) {
    var listeners = this.events[event]
    if (!listeners || listeners.length === 0) return false

    var i
    var remove = []

    for (i = 0; i < listeners.length; i++) {
      var listener = listeners[i]
      if (listener.once) remove.push(listener)

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
          for (var j = 1; j < arguments.length; j++) {
            args[j - 1] = arguments[j]
          }
          listener.fn.apply(this, args)
      }
    }

    for (i = 0; i < remove.length; i++) {
      remove[i].rm()
    }

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
   * for (listener of ee.events['tick']) {
   *   if (ee.call(listener, tickType, tickDuration) === false) {
   *     break
   *   }
   * }
   */
  call: function call (listener, a1, a2, a3) {
    if (listener.once) listener.rm()
    switch (arguments.length) {
      case 1:
        return listener.fn.call(this)
      case 2:
        return listener.fn.call(this, a1)
      case 3:
        return listener.fn.call(this, a1, a2)
      default:
        var args = new Array(arguments.length - 1)
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i]
        }
        return listener.fn.apply(this, args)
    }
  }

}

module.exports = NanoEvents
