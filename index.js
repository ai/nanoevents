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
   * Event names in keys and arrays with listeners in values.
   * @type {object}
   *
   * @example
   * Object.keys(ee.events)
   */
  this.events = { }
}

function add (events, event, cb) {
  if (typeof cb !== 'function') {
    throw new Error('Listener must be a function')
  }

  var l = { fn: cb }

  l.rm = function () {
    var list = events[event]
    if (list) {
      var index = list.indexOf(l)
      if (index > -1) {
        if (list[1]) {
          list.splice(index, 1)
        } else {
          delete events[event]
        }
      }
    }
  }

  if (events[event]) {
    events[event].push(l)
  } else {
    events[event] = [l]
  }
  return l
}

NanoEvents.prototype = {

  /**
   * Add a listener for a given event.
   *
   * @param {string} event The event name.
   * @param {function} cb The listener function.
   *
   * @return {function} Unbind listener from event.
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
  on: function on (event, cb) {
    return add(this.events, event, cb).rm
  },

  /**
   * Add a one-time listener for a given event.
   *
   * @param {string} event The event name.
   * @param {function} cb The listener function.
   *
   * @return {function} Unbind listener from event.
   *
   * @example
   * const unbind = ee.once('tick', (tickType, tickDuration) => {
   *   works = true
   * })
   */
  once: function once (event, cb) {
    var l = add(this.events, event, cb)
    l.once = true
    return l.rm
  },

  /**
   * Calls each of the listeners registered for a given event.
   *
   * @param {string} event The event name.
   * @param {...*} arguments The arguments for listeners.
   *
   * @returns {boolean} `true` if the event had listeners, else `false`.
   *
   * @example
   * ee.emit('tick', tickType, tickDuration)
   */
  emit: function emit (event) {
    var list = this.events[event]
    if (!list || !list[0]) return false

    list = list.slice()

    for (
      var l, i = 0, args = [].slice.call(arguments, 1);
      l = list[i++]; // eslint-disable-line no-cond-assign
      l.once && l.rm()
    ) {
      l.fn.apply(this, args)
    }

    return true
  }
}

module.exports = NanoEvents
