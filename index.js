(
  /**
   * Interface for event subscription.
   *
   * @example
   * var NanoEvents = require('nanoevents')
   *
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
   * @alias NanoEvents
   * @class
   */
  module.exports = function NanoEvents () {
    /**
     * Event names in keys and arrays with listeners in values.
     * @type {object}
     *
     * @example
     * Object.keys(ee.events)
     *
     * @alias NanoEvents#events
     */
    this.events = { }
  }
).prototype = {

  /**
   * Calls each of the listeners registered for a given event.
   *
   * @param {string} event The event name.
   * @param {...*} arguments The arguments for listeners.
   *
   * @return {undefined}
   *
   * @example
   * ee.emit('tick', tickType, tickDuration)
   *
   * @alias NanoEvents#emit
   * @method
   */
  emit: function emit (event) {
    // event variable is reused and repurposed, now it’s an array of handlers
    event = this.events[event]
    if (event && event[0]) { // event[0] === Array.isArray(event)
      var args = event.slice.call(arguments, 1)
      event.slice().map(function (i) {
        i.apply(this, args) // this === global or window
      })
    }
  },

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
   *
   * @alias NanoEvents#on
   * @method
   */
  on: function on (event, cb) {
    if (process.env.NODE_ENV !== 'production' && typeof cb !== 'function') {
      throw new Error('Listener must be a function')
    }

    // event variable is reused and repurposed, now it's an array of handlers
    event = this.events[event] = this.events[event] || []
    event.push(cb)

    return function () {
      // a.splice(i >>> 0, 1) === if (i !== -1) a.splice(i, 1)
      // -1 >>> 0 === 0xFFFFFFFF, max possible array length
      event.splice(event.indexOf(cb) >>> 0, 1)
    }
  }
}
