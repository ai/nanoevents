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

NanoEvents.prototype = {

  /**
   * Add a listener for a given event.
   *
   * @param {string} event The event name.
   * @param {function} callback The listener function.
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
  on: function on (event, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Listener must be a function')
    }

    var events = this.events

    if (events[event]) {
      events[event].push(callback)
    } else {
      events[event] = [callback]
    }

    return function () {
      var list = events[event]
      if (list) {
        var index = list.indexOf(callback)
        if (index > -1) {
          if (list[1]) { // list[1] === list.length > 1
            list.splice(index, 1)
          } else {
            delete events[event]
          }
        }
      }
    }
  },

  /**
   * Calls each of the listeners registered for a given event.
   *
   * @param {string} event The event name.
   * @param {...*} arguments The arguments for listeners.
   *
   * @returns {undefined}
   *
   * @example
   * ee.emit('tick', tickType, tickDuration)
   */
  emit: function emit (event) {
    var list = this.events[event]
    if (!list || !list[0]) return // list[0] === Array.isArray(list)

    var args = list.slice.call(arguments, 1)
    list.slice().map(function (i) {
      i.apply(this, args)
    })
  }
}

module.exports = NanoEvents
